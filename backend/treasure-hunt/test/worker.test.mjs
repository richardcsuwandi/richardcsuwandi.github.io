import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/worker.js';

// Exercise the real SQL and transactions, using SQLite behind the D1 interface.
function fixture() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_game.sql', import.meta.url), 'utf8'));
  class Statement {
    constructor(sql, args = []) { this.sql = sql; this.args = args; }
    bind(...args) { return new Statement(this.sql, args); }
    async first() { return db.prepare(this.sql).get(...this.args) || null; }
    async run() { const r = db.prepare(this.sql).run(...this.args); return { meta: { changes: Number(r.changes) } }; }
    async all() { return { results: db.prepare(this.sql).all(...this.args) }; }
  }
  const env = { GAME_SECRET: 'test-secret-is-never-used-in-production', SITE_ORIGIN: 'https://example.com', DB: {
    prepare: sql => new Statement(sql),
    async batch(statements) {
      db.exec('BEGIN');
      try { const results = []; for (const s of statements) results.push(await s.all()); db.exec('COMMIT'); return results; }
      catch (e) { db.exec('ROLLBACK'); throw e; }
    }
  } };
  async function request(path, body, token, headers = {}) {
    const r = await worker.fetch(new Request('https://game.example' + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: 'Bearer ' + token } : {}), ...headers },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    }), env);
    return { status: r.status, body: await r.json(), headers: r.headers };
  }
  return { db, env, request };
}

test('five server-scored probes, idempotency, auth, leaderboard and hidden terrain', async () => {
  const { request } = fixture();
  const visit = (await request('/v1/visits', { kind: 'agent', agent: 'Codex', name: 'Test agent' })).body;
  const token = visit.token;
  const run = (await request('/v1/runs', {}, token)).body;
  const path = '/v1/runs/' + run.round.id;
  assert.equal(run.terrainSeed, null);
  assert.equal((await request(path)).status, 401);
  const other = (await request('/v1/visits', {})).body;
  assert.equal((await request(path, undefined, other.token)).status, 404);
  assert.equal((await request('/v1/runs', {}, token)).body.round.id, run.round.id);
  assert.equal((await request(path + '/probes', { x: -1, y: 50, requestId: 'invalid-point' }, token)).status, 400);
  let final;
  for (let i = 0; i < 5; i++) {
    const data = { x: i * 20, y: 50, requestId: 'probe-id-' + i, signal: 100, score: 100 };
    const r = await request(path + '/probes', data, token);
    assert.equal(r.status, 200);
    final = r.body;
    assert.equal(final.observations.length, i + 1);
    assert.equal((await request(path + '/probes', data, token)).body.observations.length, i + 1);
    assert.equal(final.terrainSeed, null);
    assert.equal(JSON.stringify(final).includes('requestId'), false);
  }
  assert.equal(final.complete, true);
  assert.equal(final.result.peak, null);
  assert.notEqual(final.result.score, 100);
  assert.equal((await request(path + '/probes', { x: 90, y: 90, requestId: 'probe-sixth' }, token)).status, 409);
  assert.equal((await request(path + '/probes', { x: 90, y: 90, requestId: 'probe-id-0' }, token)).status, 409);
  const board = (await request('/v1/leaderboard')).body;
  assert.equal(board.entries.length, 1);
  assert.equal(board.entries[0].score, final.result.score);
  assert.equal(board.entries[0].identitySource, 'self-reported');
  assert.equal(JSON.stringify(board).includes(token), false);
});

test('check-ins count once per event, identify agents honestly and expose no secrets', async () => {
  const { request } = fixture();
  const v = (await request('/v1/visits', { kind: 'agent', agent: 'Codex', model: 'test-model', eventId: 'page-load-1' })).body;
  await request('/v1/visits', { eventId: 'page-load-1' }, v.token);
  await request('/v1/visits', { eventId: 'page-load-2' }, v.token);
  await request('/v1/visits', {}, undefined, { 'User-Agent': 'ClaudeBot/1.0' });
  await request('/v1/visits', {});
  const a = (await request('/v1/activity')).body;
  assert.equal(a.checkins, 4);
  assert.equal(a.checkinsToday, 4);
  assert.equal(a.agentCheckinsToday, 3);
  assert.equal(a.agentIdentities, 2);
  assert.equal(a.visitorIdentities, 3);
  assert.equal(a.recent.find(x => x.agent === 'Codex').model, 'test-model');
  assert.equal(a.recent.find(x => x.agent === 'ClaudeBot').identitySource, 'user-agent (unverified)');
  assert.equal(JSON.stringify(a).includes(v.token), false);
  assert.equal((await request('/v1/visits', { eventId: 'bad' })).status, 400);
  assert.equal((await request('/v1/activity')).body.visitorIdentities, 3);
  assert.equal((await request('/v1/activity')).body.checkins, 4);
});

test('past games reveal terrain and refuse further probes', async () => {
  const { db, request } = fixture();
  const v = (await request('/v1/visits', {})).body;
  const game = (await request('/v1/runs', {}, v.token)).body;
  db.prepare('UPDATE runs SET day = ? WHERE id = ?').run('2020-01-01', game.round.id);
  const path = '/v1/runs/' + game.round.id;
  const old = (await request(path, undefined, v.token)).body;
  assert.equal(old.closed, true);
  assert.equal(old.terrainSeed.length, 64);
  assert.equal(old.result.peak.signal, 100);
  assert.equal((await request(path + '/probes', { x: 1, y: 2, requestId: 'old-probe' }, v.token)).status, 409);
});

test('concurrent probes cannot restore or overspend the budget', async () => {
  const { request } = fixture();
  const v = (await request('/v1/visits', {})).body;
  const game = (await request('/v1/runs', {}, v.token)).body;
  const path = '/v1/runs/' + game.round.id;
  const attempts = await Promise.all(Array.from({ length: 10 }, (_, i) => request(path + '/probes', { x: i, y: i, requestId: 'concurrent-' + i }, v.token)));
  assert.ok(attempts.some(r => r.status === 409));
  const current = (await request(path, undefined, v.token)).body;
  assert.equal(current.observations.length, attempts.filter(r => r.status === 200).length);
  assert.ok(current.observations.length <= 5);
});

test('origin policy, malformed input and throttling', async () => {
  const { request, env } = fixture();
  assert.equal((await request('/v1/activity', undefined, undefined, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await request('/v1/activity', undefined, undefined, { Origin: env.SITE_ORIGIN })).headers.get('Access-Control-Allow-Origin'), env.SITE_ORIGIN);
  assert.equal((await request('/v1/leaderboard?day=2026-02-31')).status, 400);
  assert.equal((await request('/v1/visits', { name: 'x'.repeat(5000) })).status, 413);
  assert.equal((await request('/v1/visits', { kind: 'robot' })).status, 400);
  for (let i = 0; i < 28; i++) await request('/v1/visits', {});
  assert.equal((await request('/v1/visits', {})).status, 429);
});
