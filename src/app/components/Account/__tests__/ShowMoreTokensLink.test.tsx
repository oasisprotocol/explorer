import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/renderWithProviders'
import { ShowMoreTokensLink } from './../ShowMoreTokensLink'

const mockedToken1 = {
  balance: '1123.5',
  runtime: 'emerald',
  token_contract_addr: 'oasis1qrg90d4qlelg5zg4q4sd4y0z8j2lpjpvuspzjly1',
  token_name: 'ROSE',
  token_symbol: 'ROSE',
  token_type: 'ERC20',
  token_decimals: 18,
}

const mockedToken2 = {
  balance: '65913.17',
  runtime: 'emerald',
  token_contract_addr: 'oasis1qrg90d4qlelg5zg4q4sd4y0z8j2lpjpvuspzjly2',
  token_name: 'USDT',
  token_symbol: 'USDT',
  token_type: 'ERC20',
  token_decimals: 18,
}

const mockedToken3 = {
  balance: '0.012345',
  runtime: 'emerald',
  token_contract_addr: 'oasis1qrg90d4qlelg5zg4q4sd4y0z8j2lpjpvuspzjly3',
  token_name: 'ERC721',
  token_symbol: 'ERC721',
  token_type: 'ERC721',
  token_decimals: 18,
}

describe('ShowMoreTokensLink', () => {
  it('should not render show more link', () => {
    const { rerender } = renderWithProviders(<ShowMoreTokensLink tokens={[]} pills={[]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()

    rerender(<ShowMoreTokensLink tokens={[mockedToken1]} pills={[mockedToken1]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should render ERC20 link if there is any ERC20 token not included in pills', () => {
    renderWithProviders(
      <ShowMoreTokensLink tokens={[mockedToken1, mockedToken2, mockedToken3]} pills={[mockedToken1]} />,
    )

    expect(screen.getByText('+ 2 more')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/tokens/erc-20')
  })

  it('should render ERC721 link if there is no ERC20 token', () => {
    renderWithProviders(
      <ShowMoreTokensLink
        tokens={[mockedToken1, mockedToken2, mockedToken3]}
        pills={[mockedToken1, mockedToken2]}
      />,
    )

    expect(screen.getByText('+ 1 more')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/tokens/erc-721')
  })
})
