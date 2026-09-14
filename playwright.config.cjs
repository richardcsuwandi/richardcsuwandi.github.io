const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  workers: 1,
  expect: { timeout: 5000 },
  use: {
    baseURL: process.env.SITE_URL || 'http://127.0.0.1:4000',
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure'
  },
  reporter: 'list'
})
