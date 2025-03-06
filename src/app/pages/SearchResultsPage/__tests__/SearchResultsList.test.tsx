import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/__tests__/renderWithProviders.test'

import {
  sapphireParsedBlock,
  suggestedParsedAccountResult,
  suggestedParsedBlock,
} from '../../../utils/test-fixtures'
import { Network } from '../../../../types/network'
import { SearchResultsList } from '../SearchResultsList'
import { Ticker } from '../../../../types/ticker'

jest.mock('../../../hooks/useAccountMetadata')

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
          [Ticker.ROSE]: {
            isLoading: false,
            isFree: false,
            price: 1,
            fiatCurrency: 'usd',
            hasUsedCoinGecko: true,
          },
          [Ticker.TEST]: {
            isLoading: false,
            isFree: true,
            hasUsedCoinGecko: false,
          },
          [Ticker.EUROe]: {
            isLoading: false,
            isFree: false,
            price: 1,
            fiatCurrency: 'usd',
            hasUsedCoinGecko: true,
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
          [Ticker.ROSE]: {
            isLoading: false,
            isFree: false,
            price: 1,
            fiatCurrency: 'usd',
            hasUsedCoinGecko: true,
          },
          [Ticker.TEST]: {
            isLoading: false,
            isFree: true,
            hasUsedCoinGecko: false,
          },
          [Ticker.EUROe]: {
            isLoading: false,
            isFree: false,
            price: 1,
            fiatCurrency: 'usd',
            hasUsedCoinGecko: true,
          },
        }}
      />,
    )

    expect(screen.getByText('Tokens')).toBeInTheDocument()
    expect(screen.getByText('337,325.43836… FTP')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /337,325.43836/ })).toHaveAttribute(
      'href',
      '/mainnet/emerald/address/0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3/tokens/erc-20#0xF8E3DE55D24D13607A12628E0A113B66BA578bD1',
    )
  })
})
