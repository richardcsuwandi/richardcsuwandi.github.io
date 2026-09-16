const { test, expect } = require('@playwright/test')

for (const id of ['research-list', 'projects-list', 'news-list']) {
  test(`${id} scrolls with the wheel and releases scrolling at both edges`, async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const region = page.locator('#' + id)
    const client = await page.context().newCDPSession(page)
    async function wheelGesture(distance) {
      const bounds = await region.boundingBox()
      // A complete gesture includes the end phase, releasing Chromium's scroll latch.
      await client.send('Input.synthesizeScrollGesture', {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
        yDistance: -distance,
        gestureSourceType: 'mouse'
      })
    }
    // Leave room below the final section to exercise native downward chaining.
    if (id === 'news-list') await page.addStyleTag({ content: 'body { padding-bottom: 100vh !important; }' })
    await region.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await region.hover()
    const pageY = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 180)
    await expect.poll(() => region.evaluate(el => el.scrollTop)).toBeGreaterThan(0)
    expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(pageY, 0)
    await region.evaluate(el => el.scrollTo({ top: el.scrollHeight, behavior: 'instant' }))
    await wheelGesture(200)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(pageY)
    await region.evaluate(el => {
      el.scrollIntoView({ block: 'center', behavior: 'instant' })
      el.scrollTo({ top: 0, behavior: 'instant' })
    })
    await region.hover()
    const topY = await page.evaluate(() => window.scrollY)
    await wheelGesture(-200)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(topY)
  })
}

test('keyboard scrolling reaches the last paper and abstracts do not resize the viewport', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const region = page.locator('#research-list')
  const height = await region.evaluate(el => el.clientHeight)
  const abstract = region.getByRole('button', { name: 'Abstract', exact: true }).first()
  await abstract.click()
  const panel = page.locator(`[id="${await abstract.getAttribute('aria-controls')}"]`)
  await expect(panel).toBeVisible()
  await expect.poll(() => panel.evaluate(el => el.getAnimations().length)).toBe(0)
  expect(await region.evaluate(el => el.clientHeight)).toBe(height)
  await region.focus()
  await page.keyboard.press('End')
  await expect.poll(() => region.evaluate(el => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop))).toBeLessThan(2)
  const last = region.locator('.bibliography > li').last().getByRole('button', { name: 'Abstract', exact: true })
  await last.focus()
  await expect(last).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(last).toHaveAttribute('aria-expanded', 'true')
  await region.focus()
  await page.keyboard.press('Home')
  await expect.poll(() => region.evaluate(el => el.scrollTop)).toBe(0)
})

test('print includes the full collections', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.emulateMedia({ media: 'print' })
  for (const id of ['research-list', 'projects-list', 'news-list']) {
    await expect(page.locator('#' + id)).toHaveCSS('max-height', 'none')
    await expect(page.locator('#' + id)).toHaveCSS('overflow-y', 'visible')
  }
})

test('mobile touch scrolling works after resizing and expanding an abstract', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'domcontentloaded' })
  const region = page.locator('#research-list')
  await region.getByRole('button', { name: 'Abstract', exact: true }).first().click()
  await region.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  const bounds = await region.boundingBox()
  const client = await context.newCDPSession(page)
  const x = Math.round(bounds.x + bounds.width / 2)
  const y = Math.round(Math.min(bounds.y + bounds.height - 40, 780))
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  for (let offset = 20; offset <= 220; offset += 20) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - offset }] })
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => region.evaluate(el => el.scrollTop)).toBeGreaterThan(0)
  await page.setViewportSize({ width: 844, height: 390 })
  expect(await region.evaluate(el => el.clientHeight)).toBeLessThan(320)
  await region.evaluate(el => el.scrollTo({ top: el.scrollHeight, behavior: 'instant' }))
  expect(await region.evaluate(el => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop))).toBeLessThan(2)
  await context.close()
})
