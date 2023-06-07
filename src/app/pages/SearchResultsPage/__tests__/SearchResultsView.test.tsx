import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/renderWithProviders'
import { SearchResultsView } from '../SearchResultsView'
import {
  sapphireParsedBlock,
  suggestedParsedAccount,
  suggestedParsedBlock,
} from '../../../utils/test-fixtures'
import { Network } from '../../../../types/network'
import { Layer } from '../../../../oasis-indexer/api'

describe('SearchResultsView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2023, 1, 1))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('block should correctly link to transactions', () => {
    renderWithProviders(
      <SearchResultsView
        wantedScope={{ network: Network.mainnet, layer: Layer.emerald }}
        searchResults={{
          blocks: [suggestedParsedBlock, sapphireParsedBlock],
          transactions: [],
          accounts: [],
          allResults: [suggestedParsedBlock, sapphireParsedBlock],
        }}
        isLoading={false}
        tokenPrices={{
          [Network.mainnet]: {
            isLoading: false,
            isFree: false,
            price: 1,
            hasUsedCoinGecko: true,
          },
          [Network.testnet]: {
            isLoading: false,
            isFree: true,
            hasUsedCoinGecko: false,
          },
        }}
      />,
    )
    expect(screen.getByText('1,396,255')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '10 transactions' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '10 transactions' })).toHaveAttribute(
      'href',
      '/mainnet/emerald/blocks/1396255#transactions',
    )

    expect(screen.getByText('143,553')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '1 transaction' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '1 transaction' })).toHaveAttribute(
      'href',
      '/mainnet/sapphire/blocks/143553#transactions',
    )
  })

  it('account should correctly link to erc-20 tokens', () => {
    renderWithProviders(
      <SearchResultsView
        wantedScope={{ network: Network.mainnet, layer: Layer.emerald }}
        searchResults={{
          blocks: [],
          transactions: [],
          accounts: [suggestedParsedAccount],
          allResults: [suggestedParsedAccount],
        }}
        isLoading={false}
        tokenPrices={{
          [Network.mainnet]: {
            isLoading: false,
            isFree: false,
            price: 1,
            hasUsedCoinGecko: true,
          },
          [Network.testnet]: {
            isLoading: false,
            isFree: true,
            hasUsedCoinGecko: false,
          },
        }}
      />,
    )

    expect(screen.getByText('EVM tokens')).toBeInTheDocument()
    expect(screen.getByText('337325.43836… FTP')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /337325.43836/ })).toHaveAttribute(
      'href',
      '/mainnet/emerald/account/0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3/tokens/erc-20#oasis1qpssvkplnlpzdvwxpgmrhf9j5lkyvaylcvujhjhg',
    )
  })
})
