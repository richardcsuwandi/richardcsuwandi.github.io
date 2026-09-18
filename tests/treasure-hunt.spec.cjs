const { test, expect } = require("@playwright/test");

// Exercise the offline practice engine separately from the shared API suite.
test.beforeEach(async ({ page }) => {
  await page.route("**/agents/", async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace(/data-api-url="[^"]*"/, 'data-api-url=""') });
  });
});

async function openGame(page) {
  await page.goto("/agents/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.treasureHunt));
}

test("five probes reveal the terrain, persist across reload, and replay without changing the budget", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openGame(page);
  await expect(page.locator("#th-terrain")).toBeHidden();
  await expect(page.locator("#th-terrain")).toBeEmpty();
  await expect(page.locator("#th-submit")).toBeDisabled();
  for (const [x, y] of [
    [10, 20],
    [25, 45],
    [50, 50],
    [75, 65],
    [90, 80],
  ]) {
    await page.locator("#th-x").fill(String(x));
    await page.locator("#th-y").fill(String(y));
    await page.locator("#th-submit").click();
  }
  await expect(page.locator("#th-remaining")).toHaveText("0");
  await expect(page.locator("#th-terrain")).toBeVisible();
  await expect(page.locator("#th-result")).toBeVisible();
  await expect(page.locator("#th-probes > g")).toHaveCount(5);
  const final = await page.evaluate(() => window.treasureHunt.getState());
  expect(final.result.peak.signal).toBe(100);
  expect(final.result.randomBaseline.runs).toBe(512);
  await page.locator("#th-replay-step").fill("2");
  await expect(page.locator("#th-probes > g")).toHaveCount(2);
  await expect(page.locator("#th-remaining")).toHaveText("0");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.treasureHunt));
  expect(await page.evaluate(() => window.treasureHunt.getState())).toEqual(final);
  await expect(page.locator("#th-history .th-history-row")).toHaveCount(1);
  await page.locator("#th-new-practice").click();
  await expect(page.locator("#th-remaining")).toHaveText("5");
  await expect(page.locator("#th-terrain")).toBeEmpty();
  await page.locator("#th-daily").click();
  await expect(page.locator("#th-remaining")).toHaveText("0");
  expect(errors).toEqual([]);
});

test("agent interface validates probes, hides the result until completion, and returns defensive copies", async ({ page }) => {
  await openGame(page);
  const initial = await page.evaluate(() => window.treasureHunt.getState());
  expect(initial.result).toBeNull();
  expect(initial).not.toHaveProperty("peak");
  const result = await page.evaluate(() => {
    const messages = [];
    for (const [x, y] of [
      [-1, 2],
      [101, 1],
      [1.2, 5],
      ["2", 4],
    ]) {
      try {
        window.treasureHunt.probe(x, y);
      } catch (error) {
        messages.push(error.message);
      }
    }
    window.treasureHunt.probe(0, 100);
    try {
      window.treasureHunt.probe(0, 100);
    } catch (error) {
      messages.push(error.message);
    }
    const copy = window.treasureHunt.getState();
    copy.observations[0].x = 90;
    copy.round.id = "changed";
    return { messages, state: window.treasureHunt.getState() };
  });
  expect(result.messages).toHaveLength(5);
  expect(result.state.remaining).toBe(4);
  expect(result.state.observations[0].x).toBe(0);
  expect(result.state.round.id).toEqual(initial.round.id);
  await expect(page.locator("#th-terrain")).toBeEmpty();
});

test("pointer and keyboard select the correct map coordinates", async ({ page }) => {
  await openGame(page);
  const map = page.locator("#th-map");
  await map.scrollIntoViewIfNeeded();
  const box = await map.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator("#th-x")).toHaveValue("50");
  await expect(page.locator("#th-y")).toHaveValue("50");
  await map.focus();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Shift+ArrowRight");
  await expect(page.locator("#th-x")).toHaveValue("60");
  await expect(page.locator("#th-y")).toHaveValue("51");
  await page.keyboard.press("Enter");
  await expect(page.locator("#th-remaining")).toHaveText("4");
});

test("denied storage still allows a complete game", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
  });
  await openGame(page);
  await expect(page.locator("#th-storage-warning")).toBeVisible();
  await page.evaluate(() => {
    for (let x = 0; x < 5; x++) window.treasureHunt.probe(x * 20, 50);
  });
  await expect(page.locator("#th-result")).toBeVisible();
});

test("corrupt saved data is ignored", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("field-station:treasure-hunt:v1", JSON.stringify({ version: 1, activeId: "bad", rounds: [{ id: "bad", points: null }] }));
  });
  await openGame(page);
  await expect(page.locator("#th-remaining")).toHaveText("5");
});

test("UTC rollover offers a fresh daily map without interrupting the current round", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-09-19T23:59:50Z") });
  await openGame(page);
  await page.evaluate(() => window.treasureHunt.probe(50, 50));
  await page.clock.fastForward(70000);
  await expect(page.locator("#th-new-day")).toBeVisible();
  await expect(page.locator("#th-remaining")).toHaveText("4");
  await page.locator("#th-new-day-button").click();
  await expect(page.locator("#th-map-id")).toHaveText("2026-09-20 / UTC");
  await expect(page.locator("#th-remaining")).toHaveText("5");
});

for (const width of [320, 390, 1280]) {
  for (const theme of ["light", "dark"]) {
    test(`treasure hunt fits ${width}px in ${theme} mode`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openGame(page);
      await page.evaluate((theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-theme-setting", theme);
      }, theme);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.evaluate(() => {
        for (let x = 0; x < 5; x++) window.treasureHunt.probe(x * 20, 50);
      });
      await expect(page.locator("#th-result")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

test("rules remain readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/agents/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("noscript > .th-notice")).toBeVisible();
  await page.locator("#th-agent-notes summary").click();
  await expect(page.locator(".th-agent-content")).toBeVisible();
  await expect(page.locator("#th-submit")).toBeDisabled();
  await context.close();
});
