import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    url: 'http://localhost:1234',
    command: 'yarn --cwd ../ run start',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
})
