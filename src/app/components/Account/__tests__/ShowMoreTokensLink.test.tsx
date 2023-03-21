import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/renderWithProviders'
import { ShowMoreTokensLink } from './../ShowMoreTokensLink'
import { RuntimeAccount, Token } from '../../../../oasis-indexer/api'

const mockedAccount = {
  address: 'oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t',
  layer: 'emerald',
} as RuntimeAccount

const mockedToken1: Token = {
  balance: '1123.5',
  token_contract_addr: 'oasis1qrg90d4qlelg5zg4q4sd4y0z8j2lpjpvuspzjly1',
  token_name: 'ROSE',
  token_symbol: 'ROSE',
  token_type: 'ERC20',
  token_decimals: 18,
}

const mockedToken2: Token = {
  balance: '65913.17',
  token_contract_addr: 'oasis1qrg90d4qlelg5zg4q4sd4y0z8j2lpjpvuspzjly2',
  token_name: 'USDT',
  token_symbol: 'USDT',
  token_type: 'ERC20',
  token_decimals: 18,
}

const mockedToken3: Token = {
  balance: '0.012345',
  token_contract_addr: 'oasis1qrg90d4qlelg5zg4q4sd4y0z8j2lpjpvuspzjly3',
  token_name: 'ERC721',
  token_symbol: 'ERC721',
  token_type: 'ERC721',
  token_decimals: 18,
}

const mockedToken4: Token = {
  balance: '1123.5',
  token_contract_addr: 'oasis1qrg90d4qlelg5zg4q4sd4y0z8j2lpjpvuspzjly4',
  token_name: 'ROSE',
  token_symbol: 'ROSE',
  token_type: 'ERC20',
  token_decimals: 18,
}

describe('ShowMoreTokensLink', () => {
  it('should not render show more link', () => {
    const { rerender } = renderWithProviders(
      <ShowMoreTokensLink account={mockedAccount} tokens={[]} pills={[]} />,
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()

    rerender(<ShowMoreTokensLink account={mockedAccount} tokens={[mockedToken1]} pills={[mockedToken1]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should render ERC20 link if there is any ERC20 token not included in pills', () => {
    renderWithProviders(
      <ShowMoreTokensLink
        account={mockedAccount}
        tokens={[mockedToken1, mockedToken2, mockedToken3, mockedToken4]}
        pills={[mockedToken1]}
      />,
    )

    expect(screen.getByText('+ 3 more')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/emerald/account/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t/tokens/erc-20',
    )
  })

  it('should render ERC721 link if there is no ERC20 token', () => {
    renderWithProviders(
      <ShowMoreTokensLink
        account={mockedAccount}
        tokens={[mockedToken1, mockedToken2, mockedToken3]}
        pills={[mockedToken1, mockedToken2]}
      />,
    )

    expect(screen.getByText('+ 1 more')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/emerald/account/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t/tokens/erc-721',
    )
  })
})
