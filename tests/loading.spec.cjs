const { test, expect } = require('@playwright/test')

test('local controls initialize while an unrelated deferred script is still loading', async ({ page }) => {
  let release
  const stalled = new Promise(resolve => { release = resolve })
  await page.route('**/mathjax@*/**', async route => {
    await stalled
    await route.abort()
  })
  try {
    await page.goto('/', { waitUntil: 'commit' })
    await expect(page.locator('script[src*="disclosures.js"]')).toBeAttached({ timeout: 45000 })
    await expect(page.getByRole('button', { name: 'Abstract', exact: true }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('#research-list')).toHaveCSS('overflow-y', 'auto')
    await expect(page.locator('.collection-toggle')).toHaveCount(0)
  } finally {
    release()
  }
})
