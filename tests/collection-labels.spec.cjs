const { test, expect } = require('@playwright/test')

test('collections have named keyboard-accessible scroll regions and no show-all controls', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.collection-toggle, .collection-footer')).toHaveCount(0)
  for (const name of ['Selected research papers', 'Open source projects', 'News updates']) {
    const region = page.getByRole('region', { name, exact: true })
    await expect(region).toHaveAttribute('tabindex', '0')
    await expect(region).toHaveCSS('overflow-y', 'auto')
    await expect(region).toHaveCSS('scroll-behavior', 'smooth')
    expect(await region.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true)
  }
})
