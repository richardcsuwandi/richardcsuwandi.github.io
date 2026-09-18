const { test, expect } = require('@playwright/test');

async function openShared(page) {
  await page.goto('/agents/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.treasureHunt));
  await page.evaluate(() => window.treasureHunt.ready);
  expect(await page.evaluate(() => window.treasureHunt.getState().edition)).toBe('shared-daily');
  await expect(page.locator('#th-status')).toContainText('Connected');
}

test('shared browser play records identity, persists probes and publishes only server scores', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await openShared(page);
  const base = await page.locator('#treasure-hunt').getAttribute('data-api-url');
  // This suite must only generate synthetic identities in the local test database.
  expect(base).toBe('http://127.0.0.1:8787');
  const before = await (await request.get(base + '/v1/activity')).json();
  const name = 'Browser integration ' + Date.now();
  await page.evaluate(name => window.treasureHunt.identify({ name, kind: 'agent', agent: 'Test browser', model: 'Synthetic test only' }), name);
  await expect(page.locator('#th-activity')).toContainText(name);
  const identified = await (await request.get(base + '/v1/activity')).json();
  expect(identified.checkins).toBe(before.checkins);
  expect(identified.agentCheckinsToday).toBe(before.agentCheckinsToday + 1);
  for (const [x, y] of [[10, 20], [25, 45], [50, 50], [75, 65], [90, 80]]) {
    await page.locator('#th-x').fill(String(x));
    await page.locator('#th-y').fill(String(y));
    await page.locator('#th-submit').click();
    await expect(page.locator('#th-status')).toContainText(x === 90 ? 'Five probes complete' : 'Probe recorded');
  }
  const final = await page.evaluate(() => window.treasureHunt.getState());
  expect(final.remaining).toBe(0);
  expect(final.terrainSeed).toBeNull();
  expect(final.result.peak).toBeNull();
  await expect(page.locator('#th-terrain')).toBeHidden();
  await expect(page.locator('#th-leaderboard')).toContainText(name);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.treasureHunt));
  await page.evaluate(() => window.treasureHunt.ready);
  expect(await page.evaluate(() => window.treasureHunt.getState())).toEqual(final);
  await page.locator('#th-new-practice').click();
  for (let i = 0; i < 5; i++) await page.evaluate(i => window.treasureHunt.probe(i * 20, 50), i);
  await expect(page.locator('#th-terrain')).toBeVisible();
  await page.locator('#th-daily').click();
  await expect(page.locator('#th-remaining')).toHaveText('0');
  expect(errors).toEqual([]);
});

test('lost probe response retries the same request without spending another turn', async ({ page }) => {
  await openShared(page);
  let intercepted = false;
  await page.route('**/v1/runs/*/probes', async route => {
    if (!intercepted) {
      intercepted = true;
      await route.fetch(); // The server commits, but the response never reaches the browser.
      await route.abort('connectionreset');
    } else await route.continue();
  });
  const next = await page.evaluate(() => window.treasureHunt.probe(35, 60));
  expect(next.observations).toHaveLength(1);
  expect(next.remaining).toBe(4);
  await expect(page.locator('#th-log > li')).toHaveCount(1);
});

test('unavailable API leaves practice playable and does not present a local score as shared', async ({ page }) => {
  await page.route('**/v1/**', route => route.abort('connectionrefused'));
  await page.goto('/agents/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.treasureHunt));
  await page.evaluate(() => window.treasureHunt.ready);
  await expect(page.locator('#th-status')).toContainText('could not be reached');
  await expect(page.locator('#th-submit')).toBeDisabled();
  expect(await page.evaluate(() => window.treasureHunt.getState().connected)).toBe(false);
  await page.locator('#th-practice').click();
  const state = await page.evaluate(() => window.treasureHunt.probe(50, 50));
  expect(state.edition).toBe('local-unranked');
  expect(state.remaining).toBe(4);
});
