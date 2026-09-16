const { test, expect } = require('@playwright/test')

for (const width of [320, 390, 1280]) {
  for (const theme of ['light', 'dark']) {
    test(`${theme} theme at ${width}px preserves layout and working controls`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.emulateMedia({ colorScheme: theme })
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(value => {
        document.documentElement.setAttribute('data-theme', value)
        document.documentElement.setAttribute('data-theme-setting', value)
      }, theme)
      const trigger = page.getByRole('button', { name: 'Abstract', exact: true }).first()
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await trigger.click()
      const panel = page.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`)
      await expect(panel).toBeVisible()
      await expect(page.locator('.opensource-card:visible')).toHaveCount(await page.locator('.opensource-card').count())
      for (const id of ['research-list', 'projects-list', 'news-list']) {
        const region = page.locator('#' + id)
        expect(await region.evaluate(el => el.clientHeight <= window.innerHeight * 0.75 + 24)).toBe(true)
        expect(await region.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
        await region.evaluate(el => el.scrollTo({ top: el.scrollHeight, behavior: 'instant' }))
        expect(await region.evaluate(el => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop))).toBeLessThan(2)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      await expect(page.locator('body')).toHaveCSS('font-family', 'Inter, sans-serif')
      if (theme === 'light') {
        await expect(page.locator('body')).toHaveCSS('color', 'rgb(15, 23, 42)')
        await expect(page.locator('.clearfix a').first()).toHaveCSS('color', 'rgb(0, 99, 201)')
      }
    })
  }
}

test('reduced motion settles disclosures immediately and suppresses effects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const trigger = page.getByRole('button', { name: 'Abstract', exact: true }).first()
  await trigger.click()
  const panel = page.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`)
  expect(await panel.evaluate(el => el.getAnimations().length)).toBe(0)
  await expect(panel).toBeVisible()
  await trigger.click()
  await expect(panel).toBeHidden()
  await expect(page.locator('#research-list')).toHaveCSS('scroll-behavior', 'auto')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
})

test('all research content is readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4000/', { waitUntil: 'domcontentloaded' })
  const papers = page.locator('#research-list .blog-post-card-horizontal')
  await expect(page.locator('#research-list .blog-post-card-horizontal:visible')).toHaveCount(await papers.count())
  await expect(page.locator('.publication-abstract').first()).toBeVisible()
  await expect(page.locator('.additional-authors').first()).toBeVisible()
  await expect(page.locator('.collection-toggle')).toHaveCount(0)
  await expect(page.locator('#research-list')).toHaveCSS('overflow-y', 'auto')
  const last = papers.last().locator('.publication-abstract')
  await last.scrollIntoViewIfNeeded()
  await expect(last).toBeInViewport()
  await context.close()
})
