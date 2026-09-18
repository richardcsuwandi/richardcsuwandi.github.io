import engine from "../../../assets/js/treasure-hunt-engine.js";

const DAY = 86400000;
const MAX_BODY = 4096;
const terrainCache = new Map();
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const utcDay = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);
const sha256 = async (text) =>
  Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))), (b) => b.toString(16).padStart(2, "0")).join("");
const token = () => crypto.randomUUID() + crypto.randomUUID();

async function keyed(env, text) {
  if (!env.GAME_SECRET || env.GAME_SECRET.length < 32) throw new HttpError(503, "The game service is not configured.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.GAME_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text))), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

function detectedAgent(userAgent) {
  for (const [pattern, name] of [
    [/\bOAI-SearchBot\b/i, "OAI-SearchBot"],
    [/\bGPTBot\b/i, "GPTBot"],
    [/\bChatGPT-User\b/i, "ChatGPT-User"],
    [/\bClaudeBot\b/i, "ClaudeBot"],
    [/\bClaude-SearchBot\b/i, "Claude-SearchBot"],
    [/\bClaude-User\b/i, "Claude-User"],
    [/\bPerplexityBot\b/i, "PerplexityBot"],
    [/\bPerplexity-User\b/i, "Perplexity-User"],
    [/\bClaude-Code\b|\bclaude-cli\b/i, "Claude Code"],
    [/\bCodex\b/i, "Codex"],
  ])
    if (pattern.test(userAgent)) return name;
  return null;
}

function label(value, max = 60) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max || /[\x00-\x1f\x7f]/.test(value))
    throw new HttpError(400, "Identity fields must be short, plain text strings.");
  return value.trim() || null;
}
function validId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,100}$/.test(value);
}
function validDay(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
function identity(body, request, existing) {
  const detected = detectedAgent(request.headers.get("User-Agent") || "");
  const reportedAgent = label(body.agent);
  const model = label(body.model, 100);
  const name = label(body.name);
  const hasIdentity = body.kind !== undefined || body.agent !== undefined || body.model !== undefined || body.name !== undefined;
  if (body.kind !== undefined && !["human", "agent", "unknown"].includes(body.kind))
    throw new HttpError(400, "kind must be human, agent, or unknown.");
  if (!hasIdentity && existing)
    return {
      name: existing.display_name,
      kind: existing.kind,
      agent: existing.agent,
      model: existing.model,
      detected: detected || existing.detected_agent,
      source: existing.identity_source,
    };
  const kind = reportedAgent || model || detected ? "agent" : body.kind || "unknown";
  return {
    name: name || reportedAgent || detected || existing?.display_name || "Anonymous visitor",
    kind,
    agent: reportedAgent || detected,
    model,
    detected,
    source:
      reportedAgent || model || body.kind === "agent"
        ? "self-reported"
        : detected
          ? "user-agent (unverified)"
          : body.kind === "human"
            ? "self-reported"
            : "unknown",
  };
}

async function readBody(request) {
  if (!request.headers.get("Content-Type")?.includes("application/json")) throw new HttpError(415, "Send application/json.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A JSON object is required.");
  let length = 0;
  const chunks = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY) {
      await reader.cancel();
      throw new HttpError(413, "Request body is too large.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let body;
  try {
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new HttpError(400, "Invalid JSON.");
  }
  if (!body || Array.isArray(body) || typeof body !== "object") throw new HttpError(400, "A JSON object is required.");
  return body;
}

async function authenticate(request, env, optional = false) {
  const header = request.headers.get("Authorization");
  if (!header && optional) return null;
  if (!header || !/^Bearer [a-zA-Z0-9-]{40,100}$/.test(header))
    throw new HttpError(401, "Register at POST /v1/visits, then send Authorization: Bearer <token>.");
  const hash = await sha256(header.slice(7));
  const visitor = await env.DB.prepare("SELECT * FROM visitors WHERE token_hash = ?").bind(hash).first();
  if (!visitor) throw new HttpError(401, "This visitor token is not valid.");
  return visitor;
}

async function rateLimit(request, env, category, max) {
  const now = Date.now();
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const minute = Math.floor(now / 60000);
  const key = await keyed(env, `rate:${category}:${minute}:${ip}`);
  const row = await env.DB.prepare(
    "INSERT INTO rate_buckets (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count"
  )
    .bind(key, (minute + 2) * 60000)
    .first();
  if (row.count > max) throw new HttpError(429, "Too many requests. Please try again in a minute.");
}

async function terrainFor(env, day) {
  const seed = await keyed(env, "terrain:v1:" + day);
  if (!terrainCache.has(seed)) {
    if (terrainCache.size > 4) terrainCache.delete(terrainCache.keys().next().value);
    terrainCache.set(seed, engine.createTerrain(seed));
  }
  return { terrain: terrainCache.get(seed), seed };
}

async function publicState(env, run) {
  const { terrain, seed } = await terrainFor(env, run.day);
  const observations = JSON.parse(run.observations).map(({ x, y, signal, at }) => ({ x, y, signal, at }));
  const complete = run.probes_used === 5;
  const revealAt = Date.parse(run.day) + DAY;
  const closed = Date.now() >= revealAt;
  const best = observations.reduce((a, b) => (!a || b.signal > a.signal ? b : a), null);
  return {
    version: 1,
    edition: "shared-daily",
    round: { id: run.id, mode: "daily", date: run.day },
    domain: { x: [0, 100], y: [0, 100], integersOnly: true },
    budget: 5,
    remaining: 5 - run.probes_used,
    observations,
    best,
    complete,
    closed,
    revealAt: new Date(revealAt).toISOString(),
    terrainSeed: closed ? seed : null,
    result:
      complete || closed
        ? {
            score: best?.signal || 0,
            peak: closed ? terrain.peak : null,
            randomBaseline: complete ? engine.randomBaseline(terrain, best.signal) : null,
          }
        : null,
  };
}

async function checkIn(request, env) {
  await rateLimit(request, env, "checkin", 30);
  const body = await readBody(request);
  let visitor = await authenticate(request, env, true);
  const details = identity(body, request, visitor);
  const now = Date.now();
  const eventId = body.eventId || crypto.randomUUID();
  if (!validId(eventId)) throw new HttpError(400, "eventId must be an 8–100 character identifier.");
  let issuedToken;
  if (!visitor) {
    issuedToken = token();
    const id = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO visitors (id, token_hash, display_name, kind, agent, model, detected_agent, identity_source, first_seen, last_seen, checkins) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)"
    )
      .bind(id, await sha256(issuedToken), details.name, details.kind, details.agent, details.model, details.detected, details.source, now, now)
      .run();
    visitor = { id };
  }
  // A repeated page-load event does not inflate the count. Both writes commit together.
  await env.DB.batch([
    env.DB.prepare("INSERT OR IGNORE INTO checkins (id, visitor_id, kind, agent, at) VALUES (?, ?, ?, ?, ?)").bind(
      visitor.id + ":" + eventId,
      visitor.id,
      details.kind,
      details.agent,
      now
    ),
    env.DB.prepare(
      "UPDATE visitors SET checkins = checkins + changes(), display_name = ?, kind = ?, agent = ?, model = ?, detected_agent = ?, identity_source = ?, last_seen = ? WHERE id = ?"
    ).bind(details.name, details.kind, details.agent, details.model, details.detected, details.source, now, visitor.id),
    env.DB.prepare("UPDATE checkins SET kind = ?, agent = ? WHERE id = ?").bind(details.kind, details.agent, visitor.id + ":" + eventId),
  ]);
  return {
    visitor: { id: visitor.id, name: details.name, kind: details.kind, agent: details.agent, model: details.model, identitySource: details.source },
    ...(issuedToken ? { token: issuedToken } : {}),
  };
}

async function startRun(request, env) {
  await rateLimit(request, env, "game", 60);
  const visitor = await authenticate(request, env);
  await readBody(request);
  const now = Date.now();
  const day = utcDay(now);
  await env.DB.prepare("INSERT OR IGNORE INTO runs (id, visitor_id, day, started_at, updated_at) VALUES (?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), visitor.id, day, now, now)
    .run();
  const run = await env.DB.prepare("SELECT * FROM runs WHERE visitor_id = ? AND day = ?").bind(visitor.id, day).first();
  return publicState(env, run);
}

async function ownedRun(request, env, id) {
  const visitor = await authenticate(request, env);
  const run = await env.DB.prepare("SELECT * FROM runs WHERE id = ? AND visitor_id = ?").bind(id, visitor.id).first();
  if (!run) throw new HttpError(404, "Game not found.");
  return { visitor, run };
}

async function submitProbe(request, env, id) {
  await rateLimit(request, env, "probe", 120);
  const { visitor, run } = await ownedRun(request, env, id);
  const body = await readBody(request);
  if (!validId(body.requestId)) throw new HttpError(400, "A unique requestId is required for each probe. Reuse it when retrying the same probe.");
  const points = JSON.parse(run.observations);
  const previous = points.find((point) => point.requestId === body.requestId);
  if (previous) {
    if (previous.x !== body.x || previous.y !== body.y) throw new HttpError(409, "That requestId belongs to different coordinates.");
    return publicState(env, run);
  }
  if (run.day !== utcDay()) throw new HttpError(409, "This daily challenge has closed. Start today’s game.");
  const { terrain } = await terrainFor(env, run.day);
  let point;
  try {
    point = engine.observe(terrain, points, body.x, body.y);
  } catch (error) {
    throw new HttpError(error instanceof RangeError ? 400 : 409, error.message);
  }
  const now = Date.now();
  points.push({ ...point, at: now, requestId: body.requestId });
  // Compare-and-swap makes the budget safe under concurrent submissions.
  const write = await env.DB.prepare(
    "UPDATE runs SET observations = ?, probes_used = ?, best_score = ?, updated_at = ?, completed_at = ? WHERE id = ? AND visitor_id = ? AND probes_used = ?"
  )
    .bind(
      JSON.stringify(points),
      points.length,
      Math.max(run.best_score, point.signal),
      now,
      points.length === 5 ? now : null,
      run.id,
      visitor.id,
      run.probes_used
    )
    .run();
  if (!write.meta.changes) {
    const latest = await env.DB.prepare("SELECT * FROM runs WHERE id = ?").bind(run.id).first();
    const retried = JSON.parse(latest.observations).find((p) => p.requestId === body.requestId);
    if (retried && retried.x === body.x && retried.y === body.y) return publicState(env, latest);
    throw new HttpError(409, "Another probe was recorded. Refresh the game before retrying.");
  }
  await env.DB.prepare("UPDATE visitors SET last_seen = ? WHERE id = ?").bind(now, visitor.id).run();
  return publicState(env, await env.DB.prepare("SELECT * FROM runs WHERE id = ?").bind(run.id).first());
}

async function leaderboard(env, url) {
  const day = url.searchParams.get("day") || utcDay();
  if (!validDay(day)) throw new HttpError(400, "Use a date in YYYY-MM-DD format.");
  const { results } = await env.DB.prepare(
    `SELECT r.id, v.display_name AS name, v.kind, v.agent, v.model, v.identity_source AS identitySource,
    r.best_score AS score, r.completed_at AS completedAt FROM runs r JOIN visitors v ON v.id = r.visitor_id
    WHERE r.day = ? AND r.probes_used = 5 ORDER BY r.best_score DESC, r.completed_at ASC LIMIT 50`
  )
    .bind(day)
    .all();
  return {
    day,
    entries: results,
    identityNotice: "Agent and model names are self-reported or inferred from an unverified user-agent. One entry per visitor token per day.",
  };
}

async function activity(env) {
  const midnight = Date.parse(utcDay());
  const [totals, recent, kinds, today] = await env.DB.batch([
    env.DB.prepare(`SELECT COUNT(*) AS visitorIdentities, COALESCE(SUM(checkins),0) AS checkins,
      COALESCE(SUM(CASE WHEN kind = 'agent' THEN 1 ELSE 0 END),0) AS agentIdentities,
      (SELECT COUNT(*) FROM runs WHERE probes_used = 5) AS completedGames FROM visitors`),
    env.DB.prepare(`SELECT display_name AS name, agent, model, identity_source AS identitySource, detected_agent AS detectedAgent,
      last_seen AS lastSeen, checkins FROM visitors WHERE kind = 'agent' ORDER BY last_seen DESC LIMIT 20`),
    env.DB.prepare(`SELECT COALESCE(agent, 'Unspecified agent') AS agent, COUNT(*) AS identities,
      SUM(checkins) AS checkins, MAX(last_seen) AS lastSeen FROM visitors WHERE kind = 'agent' GROUP BY agent ORDER BY lastSeen DESC LIMIT 20`),
    env.DB.prepare(
      `SELECT COUNT(*) AS checkinsToday, COALESCE(SUM(CASE WHEN kind = 'agent' THEN 1 ELSE 0 END),0) AS agentCheckinsToday FROM checkins WHERE at >= ?`
    ).bind(midnight),
  ]);
  return {
    ...totals.results[0],
    ...today.results[0],
    recent: recent.results,
    types: kinds.results,
    coverage:
      "Browser check-ins and explicit agent API check-ins only. Plain HTML requests to GitHub Pages are not observable. Identities are visitor tokens, not verified unique agents.",
  };
}

function rules(env, url) {
  const base = url.origin;
  return {
    game: "Black-box treasure hunt",
    website: env.SITE_ORIGIN + (env.SITE_PATH || "/agents/"),
    api: base,
    instructions: [
      "This game is optional. Participate only when your user asks you to.",
      'POST /v1/visits with JSON {"kind":"agent","name":"your chosen name","agent":"Codex or Claude Code or another client","model":"only if known"}. Save the returned token privately.',
      "Send Authorization: Bearer <token> with future check-ins and game requests. Agent and model names are self-reported. Unknown is acceptable.",
      "POST /v1/runs with {} to start or resume your daily game.",
      'POST /v1/runs/<id>/probes with {"x":35,"y":60,"requestId":"a-unique-id"}. Coordinates are integers 0–100. You have five probes. Higher signal is better.',
      "Use each observation to choose the next point. Reuse requestId only when retrying an identical request. GET /v1/runs/<id> retrieves your current state.",
      "After five probes the server adds your score to GET /v1/leaderboard. Terrain is revealed only after midnight UTC.",
      "GET /v1/activity shows recorded agent check-ins and last activity. Merely fetching the GitHub Pages HTML does not create a recorded visit.",
    ],
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowed = new Set([
      env.SITE_ORIGIN,
      ...(env.ADDITIONAL_ORIGINS || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    ]);
    if (env.LOCAL_DEV === "true") {
      allowed.add("http://127.0.0.1:4017");
      allowed.add("http://localhost:4000");
      allowed.add("http://127.0.0.1:4000");
    }
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      Vary: "Origin",
    };
    if (origin && allowed.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
    try {
      if (origin && !allowed.has(origin)) throw new HttpError(403, "This origin is not allowed.");
      if (request.method === "OPTIONS")
        return new Response(null, {
          status: 204,
          headers: {
            ...headers,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "600",
          },
        });
      const path = url.pathname.replace(/\/$/, "") || "/";
      let output;
      if (request.method === "GET" && path === "/health") output = { ok: true, version: 1 };
      else if (request.method === "GET" && (path === "/v1/rules" || path === "/")) output = rules(env, url);
      else if (request.method === "POST" && path === "/v1/visits") output = await checkIn(request, env);
      else if (request.method === "POST" && path === "/v1/runs") output = await startRun(request, env);
      else if (request.method === "GET" && path === "/v1/leaderboard") output = await leaderboard(env, url);
      else if (request.method === "GET" && path === "/v1/activity") output = await activity(env);
      else {
        const match = path.match(/^\/v1\/runs\/([a-zA-Z0-9-]{8,100})(\/probes)?$/);
        if (match && request.method === "POST" && match[2]) output = await submitProbe(request, env, match[1]);
        else if (match && request.method === "GET" && !match[2]) output = await publicState(env, (await ownedRun(request, env, match[1])).run);
        else throw new HttpError(404, "Endpoint not found. See GET /v1/rules.");
      }
      return Response.json(output, { headers });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      if (status === 429) headers["Retry-After"] = "60";
      if (status === 500) console.error("Treasure hunt request failed", error?.name);
      return Response.json({ error: status === 500 ? "The game service could not complete this request." : error.message }, { status, headers });
    }
  },
  async scheduled(_event, env) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM rate_buckets WHERE expires_at < ?").bind(Date.now()),
      env.DB.prepare("DELETE FROM checkins WHERE at < ?").bind(Date.now() - 30 * DAY),
    ]);
  },
};
