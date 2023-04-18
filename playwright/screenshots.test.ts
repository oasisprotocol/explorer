import { test, expect } from '@playwright/test'
import type { GetRosePriceResponse } from '../src/coin-gecko/api'

test.use({
  locale: 'en-US',
  timezoneId: 'UTC',
})

test.beforeEach(async ({ page }) => {
  // Pin blocks
  await page.route('**/emerald/blocks?*', (route, request) => {
    const newUrl = new URL(request.url())
    newUrl.searchParams.set('to', '1159726')
    route.continue({ url: newUrl.href })
  })

  // TODO: pin transactions

  // Mock price
  await page.route(
    'https://api.coingecko.com/api/v3/simple/price?ids=oasis-network&vs_currencies=usd',
    route => {
      route.fulfill({
        json: {
          'oasis-network': { usd: 0.05 },
        } satisfies GetRosePriceResponse,
      })
    },
  )
})

test('screenshots/search.png', async ({ page }) => {
  await page.goto('http://localhost:1234/')
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(0)
  await expect(page).toHaveScreenshot({ fullPage: true })
})

test('screenshots/dashboard.png', async ({ page }) => {
  await page.goto('http://localhost:1234/emerald')
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(0)
  await page.waitForTimeout(1500) // Recharts animations
  await expect(page).toHaveScreenshot({ fullPage: true })
})

test('screenshots/blocks.png', async ({ page }) => {
  await page.goto('http://localhost:1234/emerald/blocks')
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(0)
  await expect(page).toHaveScreenshot({ fullPage: true })
})

test('screenshots/block.png', async ({ page }) => {
  await page.goto('http://localhost:1234/emerald/blocks/1159776')
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(0)
  await expect(page).toHaveScreenshot({ fullPage: true })
})

test('screenshots/transactions.png', async ({ page }) => {
  await page.goto('http://localhost:1234/emerald/transactions')
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(0)
  await expect(page).toHaveScreenshot({ fullPage: true })
})

test('screenshots/transaction.png', async ({ page }) => {
  await page.goto(
    'http://localhost:1234/emerald/transactions/7d9beafec7f985e23bf3d35fa0275bcd9b1d3750fec1291ad4f30cb043f3ee93',
  )
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(0)
  await expect(page).toHaveScreenshot({ fullPage: true })
})

test('screenshots/account.png', async ({ page }) => {
  await page.goto('http://localhost:1234/emerald/account/oasis1qp2frld759c6u92pxs768nd2ctnrduhqp5f6f273')
  await expect(page.locator('.MuiSkeleton-root')).toHaveCount(0)
  await expect(page).toHaveScreenshot({ fullPage: true })
})
