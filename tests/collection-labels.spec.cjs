const { test, expect } = require('@playwright/test')

test('all collection buttons use count-free labels', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.collection-toggle')).toHaveText([
    'Show all papers', 'Show all projects', 'Show all updates'
  ])
  for (const label of ['papers', 'projects', 'updates']) {
    await page.getByRole('button', { name: 'Show all ' + label, exact: true }).click()
    const collapse = page.getByRole('button', { name: 'Show fewer ' + label, exact: true })
    await expect(collapse).toHaveAttribute('aria-expanded', 'true')
    await collapse.click()
    await expect(page.getByRole('button', { name: 'Show all ' + label, exact: true })).toHaveAttribute('aria-expanded', 'false')
  }
})
