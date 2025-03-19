import '../../src/types/global.d.ts'
import { Page, expect, test } from '@playwright/test'

async function setup(page: Page, mode: 'allow-matomo-lib' | 'block-matomo-lib') {
  await page.route(
    url => url.href.includes('.oasis.io/v1/'),
    route => {
      // Don't respond
    },
  )
  await page.route('https://matomo.oasis.io/matomo.php?**', route => {
    // Don't send tracked events
  })
  await page.route('https://matomo.oasis.io/matomo.js', async route => {
    if (mode === 'allow-matomo-lib') route.continue()
    if (mode === 'block-matomo-lib') route.abort('blockedbyclient')
  })

  const matomoRequests: string[] = []
  page.on('request', request => {
    if (request.url().startsWith('https://matomo.oasis.io/')) matomoRequests.push(request.url())
  })

  await page.goto('http://localhost:1234/mainnet/sapphire/block')
  await expect(page.getByText('Latest Blocks')).toBeVisible()
  await page.waitForTimeout(100)

  return {
    getMatomoRequests: () => matomoRequests,
  }
}

test.describe('analytics', () => {
  test('enabled', async ({ page }) => {
    await page.addInitScript(() => (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS = 'true'))
    const { getMatomoRequests } = await setup(page, 'allow-matomo-lib')
    await expect(page.getByText('tracking')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Privacy Settings' })).toBeVisible()
    expect(getMatomoRequests()).toHaveLength(1) // Loaded library

    await page.getByRole('link', { name: 'Oasis Explorer Home' }).click()
    await page.getByRole('button', { name: 'Decline' }).click()
    expect(getMatomoRequests()).toHaveLength(1)

    await page.getByRole('button', { name: 'Privacy Settings' }).click()
    await page.getByRole('button', { name: 'Accept' }).click()
    await page.waitForTimeout(100)
    expect(getMatomoRequests()).toHaveLength(2) // Tracked

    await Promise.all([
      page.getByRole('link', { name: 'Blocks' }).first().click(),
      page.waitForRequest('https://matomo.oasis.io/matomo.php?**'), // Debounced https://github.com/matomo-org/matomo/blob/f51b30f8/js/piwik.js#L7192-L7201
    ])
    await page.waitForTimeout(100)
    expect(getMatomoRequests()).toHaveLength(3) // Tracked
  })

  test('adblocked', async ({ page }) => {
    await page.addInitScript(() => (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS = 'true'))
    const { getMatomoRequests } = await setup(page, 'block-matomo-lib')
    await expect(page.getByText('tracking')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Privacy Settings' })).toBeVisible()
    expect(getMatomoRequests()).toHaveLength(1) // Tried to load library
    await page.getByRole('link', { name: 'Oasis Explorer Home' }).click()
    await page.getByRole('button', { name: 'Privacy Settings' }).click()
    await expect(page.getByText('tracking failed')).toBeVisible()
    expect(getMatomoRequests()).toHaveLength(1) // No new requests
  })

  test('disabled in env', async ({ page }) => {
    await page.addInitScript(() => (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS = 'false'))
    const { getMatomoRequests } = await setup(page, 'allow-matomo-lib')
    await expect(page.getByText('tracking')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Privacy Settings' })).not.toBeVisible()
    expect(getMatomoRequests()).toHaveLength(0)
    await page.getByRole('link', { name: 'Oasis Explorer Home' }).click()
    expect(getMatomoRequests()).toHaveLength(0)
  })

  test('pre-consented and then disabled in env', async ({ page }) => {
    await page.addInitScript(() => (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS = 'true'))
    const { getMatomoRequests } = await setup(page, 'allow-matomo-lib')
    await test.step('consent', async () => {
      expect(getMatomoRequests()).toHaveLength(1) // Loaded library
      await page.getByRole('button', { name: 'Accept' }).click()
      await page.waitForTimeout(100)
      expect(getMatomoRequests()).toHaveLength(2) // Tracked
    })

    await page.addInitScript(() => (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS = 'false'))
    await page.goto('http://localhost:1234/mainnet/sapphire/block')
    await page.waitForTimeout(100)
    await expect(page.getByText('tracking')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Privacy Settings' })).not.toBeVisible()
    expect(getMatomoRequests()).toHaveLength(2) // No new requests
    await page.getByRole('link', { name: 'Oasis Explorer Home' }).click()
    expect(getMatomoRequests()).toHaveLength(2) // No new requests
  })

  test('track referrer (urlref)', async ({ page }) => {
    await page.addInitScript(() => (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS = 'true'))
    const { getMatomoRequests } = await setup(page, 'allow-matomo-lib')
    await expect(page.getByText('tracking')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Privacy Settings' })).toBeVisible()
    expect(getMatomoRequests()).toHaveLength(1) // Loaded library

    await page.getByRole('button', { name: 'Accept' }).click()
    await page.waitForTimeout(100)
    expect(getMatomoRequests()).toHaveLength(2) // Tracked

    // Override referrer-policy because strict-origin-when-cross-origin doesn't send referrer when going from https:// to http://.
    await page.route('https://wallet.oasis.io/', async route => {
      const response = await route.fetch()
      expect(response.headers()['referrer-policy']).toEqual('strict-origin-when-cross-origin')
      await route.fulfill({
        response,
        headers: {
          ...response.headers(),
          'referrer-policy': 'origin-when-cross-origin',
        },
      })
    })

    await page.goto('https://wallet.oasis.io/')
    await page.evaluate(() => {
      const link = document.createElement('a')
      link.href = 'http://localhost:1234/mainnet/sapphire/block'
      link.textContent = 'link-to-local-explorer'
      document.body.appendChild(link)
    })
    await page.getByRole('link', { name: 'link-to-local-explorer' }).click()
    await expect(page.getByText('Latest Blocks')).toBeVisible()
    await expect(page.evaluate(() => document.referrer)).resolves.toContain('https://wallet.oasis.io')
    await page.waitForTimeout(100)
    expect(getMatomoRequests().length).toBeGreaterThanOrEqual(3) // Tracked, possibly twice due to React StrictMode
    expect(decodeURIComponent(getMatomoRequests().at(-1)!)).toContain('urlref=https://wallet.oasis.io/&')

    await Promise.all([
      page.getByRole('link', { name: 'Oasis Explorer Home' }).click(),
      page.waitForRequest('https://matomo.oasis.io/matomo.php?**'), // Debounced https://github.com/matomo-org/matomo/blob/f51b30f8/js/piwik.js#L7192-L7201
    ])
    await page.waitForTimeout(100)
    expect(decodeURIComponent(getMatomoRequests().at(-1)!)).toContain('urlref=/mainnet/sapphire/block&')

    await Promise.all([
      page.goBack(),
      page.waitForRequest('https://matomo.oasis.io/matomo.php?**'), // Debounced https://github.com/matomo-org/matomo/blob/f51b30f8/js/piwik.js#L7192-L7201
    ])
    await page.waitForTimeout(100)
    expect(decodeURIComponent(getMatomoRequests().at(-1)!)).toContain('urlref=/&')
  })
})
