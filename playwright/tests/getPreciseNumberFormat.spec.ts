import { Page, expect, test } from '@playwright/test'
import { RuntimeAccount } from '../../src/oasis-nexus/api'

async function setup(page: Page, balance: string, decimals: number) {
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

  await page.route('**/v1/sapphire/accounts/0x0000000000000000000000000000000000000000', route => {
    route.fulfill({
      body: JSON.stringify({
        address: 'oasis1qq2v39p9fqk997vk6742axrzqyu9v2ncyuqt8uek',
        address_preimage: {
          address_data: 'AAAAAAAAAAAAAAAAAAAAAAAAAAA=',
          context: 'oasis-runtime-sdk/address: secp256k1eth',
          context_version: 0,
        },
        balances: [],
        evm_balances: [
          {
            balance: balance,
            token_decimals: decimals,
            token_contract_addr: 'oasis1qzpyvqpw4e55wj4wjasp70w30x3kxsp4evy5dtf8',
            token_contract_addr_eth: '0x6b59C68405B0216C2C8ba1EC1f8DCcBd47892c58',
            token_name: 'TokenForTests',
            token_symbol: 'USDT',
            token_type: 'ERC20',
          },
        ],
        stats: {
          num_txns: 0,
          total_received: '0',
          total_sent: '0',
        },
      } satisfies Partial<RuntimeAccount>),
    })
  })

  await page.goto(
    'http://localhost:1234/mainnet/sapphire/address/0x0000000000000000000000000000000000000000/tokens/erc-20#tokens',
  )
}

test.describe('getPreciseNumberFormat', () => {
  test('small number should be precise and formatted', async ({ page }) => {
    await setup(page, '111222333444555', 9)
    // Expect precisely formatted small number even when browser doesn't support precise formatting for large numbers
    await expect(page.getByText('111,222.333444555', { exact: true })).toBeVisible()
  })

  test('large number should be precise and formatted or fallback to precise unformatted number in browsers without support', async ({
    page,
  }) => {
    await setup(page, '111222333444555666777888999111222333444555666', 18)
    await expect(
      page
        .getByText('111,222,333,444,555,666,777,888,999.111222333444555666', { exact: true })
        // Expect precise fallback when browser doesn't support precise formatting
        .or(page.getByText('111222333444555666777888999.111222333444555666', { exact: true })),
    ).toBeVisible()
  })

  test('exceeding maximumFractionDigits:20 should fallback to precise unformatted number', async ({
    page,
  }) => {
    await setup(page, '111222333444555666777888999111222333444555666', 36)
    await expect(
      page.getByText('111222333.444555666777888999111222333444555666', { exact: true }),
    ).toBeVisible()
  })
})
