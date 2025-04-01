import { Page, expect, test } from '@playwright/test'
import { Transaction } from '../../src/oasis-nexus/api'

async function setup(page: Page) {
  await page.route(
    'https://api.coingecko.com/api/v3/simple/price?ids=oasis-network&vs_currencies=usd',
    route => {
      // Don't respond
    },
  )
  await page.route(
    url => url.href.includes('.oasis.io/v1/'),
    route => {
      // Don't respond
    },
  )
  await page.route(
    '**/v1/consensus/transactions/10dc8edd24ae89b264a295a046d9ac9b99a59d81acf3b0394bac309c09bdd7c7',
    route => {
      route.fulfill({
        body: JSON.stringify({
          is_total_count_clipped: false,
          total_count: 1,
          transactions: [
            {
              block: 10759920,
              body: {
                amount_change: '1000000000',
                beneficiary: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
              },
              fee: '0',
              gas_limit: '1288',
              hash: '10dc8edd24ae89b264a295a046d9ac9b99a59d81acf3b0394bac309c09bdd7c7',
              index: 0,
              method: 'staking.Allow',
              nonce: 41,
              sender: 'oasis1qrtyn2q78jv6plrmexrsrv4dh89wv4n49udtg2km',
              success: true,
              timestamp: '2022-07-20T17:20:45Z',
            } satisfies Partial<Transaction>,
          ],
        }),
      })
    },
  )
  await page.route(
    '**/v1/consensus/transactions/4d4903206ee68d5c60ea9b26f4a7b218b263e66e032772f2faa61a2bf7d27b2b',
    route => {
      route.fulfill({
        body: JSON.stringify({
          is_total_count_clipped: false,
          total_count: 1,
          transactions: [
            {
              block: 20780944,
              body: {
                amount_change: '5000000000000000',
                beneficiary: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
                negative: true,
              },
              fee: '0',
              gas_limit: '1290',
              hash: '4d4903206ee68d5c60ea9b26f4a7b218b263e66e032772f2faa61a2bf7d27b2b',
              index: 24,
              method: 'staking.Allow',
              nonce: 6,
              sender: 'oasis1qppz78n4lpnw9knz7d7jz7vvjrt7qd2c6ypsa7me',
              success: true,
              timestamp: '2024-08-28T02:00:29Z',
            } satisfies Partial<Transaction>,
          ],
        }),
      })
    },
  )
}

test('Allowance transaction should display relative amount', async ({ page }) => {
  await setup(page)
  await page.goto(
    'http://localhost:1234/testnet/consensus/tx/10dc8edd24ae89b264a295a046d9ac9b99a59d81acf3b0394bac309c09bdd7c7',
  )
  await expect(page.getByText('+1 TEST')).toBeVisible()
})

test('Allowance transaction should display negative amount', async ({ page }) => {
  await setup(page)
  await page.goto(
    'http://localhost:1234/mainnet/consensus/tx/4d4903206ee68d5c60ea9b26f4a7b218b263e66e032772f2faa61a2bf7d27b2b',
  )
  await expect(page.getByText('-5,000,000 ROSE')).toBeVisible()
})
