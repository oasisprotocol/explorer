import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/renderWithProviders'

import {
  sapphireParsedBlock,
  suggestedParsedAccountResult,
  suggestedParsedBlock,
} from '../../../utils/test-fixtures'
import { Network } from '../../../../types/network'
import { SearchResultsList } from '../SearchResultsList'

describe('SearchResultsView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T01:01:01Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('block should correctly link to transactions', () => {
    renderWithProviders(
      <SearchResultsList
        searchResults={[suggestedParsedBlock, sapphireParsedBlock]}
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
        title="test search"
        networkForTheme={Network.mainnet}
      />,
    )
    expect(screen.getByText('1,396,255')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '10' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '10' })).toHaveAttribute(
      'href',
      '/mainnet/emerald/block/1396255#transactions',
    )

    expect(screen.getByText('143,553')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute(
      'href',
      '/mainnet/sapphire/block/143553#transactions',
    )
  })

  it('account should correctly link to erc-20 tokens', () => {
    renderWithProviders(
      <SearchResultsList
        searchResults={[suggestedParsedAccountResult]}
        title="test search"
        networkForTheme={Network.mainnet}
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

    expect(screen.getByText('Tokens')).toBeInTheDocument()
    expect(screen.getByText('337,325.43836… FTP')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /337,325.43836/ })).toHaveAttribute(
      'href',
      '/mainnet/emerald/address/0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3/tokens/erc-20#oasis1qpssvkplnlpzdvwxpgmrhf9j5lkyvaylcvujhjhg',
    )
  })
})
