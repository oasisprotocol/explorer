import { Page, expect, test } from '@playwright/test'
import { RuntimeAccount, RuntimeEventList } from '../../src/oasis-nexus/api'

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
    '**/v1/sapphire/transactions?limit=10&offset=0&rel=0x0000000000000000000000000000000000000000',
    route => {
      route.fulfill({
        body: JSON.stringify({
          is_total_count_clipped: false,
          total_count: 0,
          transactions: [],
        }),
      })
    },
  )
  await page.route('**/v1/sapphire/accounts/0x0000000000000000000000000000000000000000', route => {
    route.fulfill({
      body: JSON.stringify({
        address: 'oasis1qq2v39p9fqk997vk6742axrzqyu9v2ncyuqt8uek',
        balances: [
          {
            balance: '116404417198000000000',
            token_decimals: 18,
            token_symbol: 'TEST',
          },
        ],
        evm_balances: [],
        stats: {
          num_txns: 0,
          total_received: '0',
          total_sent: '0',
        },
      } satisfies Partial<RuntimeAccount>),
    })
  })
  await page.route(
    '**/v1/sapphire/events?limit=10&offset=0&rel=0x0000000000000000000000000000000000000000',
    route => {
      route.fulfill({
        body: JSON.stringify({
          is_total_count_clipped: false,
          total_count: 3,
          events: [
            {
              body: {
                amount: {
                  Amount: '100000000000000000000',
                  Denomination: '',
                },
                from: 'oasis1qq235lqj77855qcemcr5w2qm372s4amqcc4v3ztc',
                nonce: 29,
                to: 'oasis1qrwncs459lauc77zw23efdn9dmfcp23cxv095l5z',
              },
              evm_log_name: '',
              round: 3038913,
              timestamp: '2023-10-16T13:13:47Z',
              tx_hash: null,
              type: 'consensus_accounts.delegate',
              layer: 'sapphire',
              network: 'testnet',
            },
            {
              body: {
                debond_end_time: 30013,
                from: 'oasis1qrwncs459lauc77zw23efdn9dmfcp23cxv095l5z',
                nonce: 30,
                shares: '100',
                to: 'oasis1qq235lqj77855qcemcr5w2qm372s4amqcc4v3ztc',
              },
              evm_log_name: '',
              round: 3038944,
              timestamp: '2023-10-16T13:18:23Z',
              tx_hash: null,
              type: 'consensus_accounts.undelegate_start',
              layer: 'sapphire',
              network: 'testnet',
            },
            {
              body: {
                amount: {
                  Amount: '100000281888000000000',
                  Denomination: '',
                },
                from: 'oasis1qrwncs459lauc77zw23efdn9dmfcp23cxv095l5z',
                shares: '100000281888',
                to: 'oasis1qq235lqj77855qcemcr5w2qm372s4amqcc4v3ztc',
              },
              evm_log_name: '',
              round: 3216917,
              timestamp: '2023-10-29T09:06:05Z',
              tx_hash: null,
              type: 'consensus_accounts.undelegate_done',
              layer: 'sapphire',
              network: 'testnet',
            },
          ],
        } satisfies Partial<RuntimeEventList>),
      })
    },
  )

  await page.goto(
    'http://localhost:1234/mainnet/sapphire/address/0x0000000000000000000000000000000000000000/events',
  )
}

test.describe('Account details page', () => {
  test('does not crash when rendering new event types', async ({ page }) => {
    await setup(page)
    await expect(page.getByText('Unknown error')).not.toBeVisible()
    await expect(page.getByText('Delegate to consensus')).toBeVisible()
    await expect(page.getByText('Start to undelegate from consensus')).toBeVisible()
    await expect(page.getByText('Undelegate from consensus finished')).toBeVisible()
  })
})
