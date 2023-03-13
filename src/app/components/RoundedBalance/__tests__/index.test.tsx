import { render, screen } from '@testing-library/react'
import { RoundedBalance, RoundedRoseBalance } from './../'

describe('RoundedBalance', () => {
  it('should render value', () => {
    render(<RoundedBalance value="0.002231" ticker="USDC" />)

    expect(screen.getByText('0.00223 USDC')).toBeInTheDocument()
  })

  it('should render rounded value', () => {
    render(<RoundedBalance value="0.00223100001" ticker="USDC" />)

    expect(screen.getByText('0.00223 USDC')).toBeInTheDocument()
  })

  it('should render variant when rounded value is equal zero', () => {
    render(<RoundedBalance value="0.00000000000002231" ticker="USDC" />)

    expect(screen.getByText('< 0.00000 USDC')).toBeInTheDocument()
  })

  it('should not round value up', () => {
    render(<RoundedBalance value="0.004795600000000000" ticker="USDC" />)

    expect(screen.getByText('0.00479 USDC')).toBeInTheDocument()
  })

  it('should not round negative value up', () => {
    render(<RoundedBalance value="-0.004795600000000000" ticker="USDC" />)

    expect(screen.getByText('-0.00479 USDC')).toBeInTheDocument()
  })
})

describe('RoundedRoseBalance', () => {
  it('should render value with ROSE ticker symbol', () => {
    render(<RoundedRoseBalance value="0.002231" />)

    expect(screen.getByText('0.00223 ROSE')).toBeInTheDocument()
  })
})
