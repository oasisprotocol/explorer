import { render, screen } from '@testing-library/react'
import { RoundedBalance } from './../'

describe('RoundedBalance', () => {
  it('should keep original value', () => {
    render(<RoundedBalance value="0.00075" ticker="USDC" />)
    expect(screen.getByText('0.00075 USDC')).toBeInTheDocument()
  })

  it('should render rounded value', () => {
    render(<RoundedBalance value="0.00223100001" ticker="USDC" />)
    expect(screen.getByText('0.00223… USDC')).toBeInTheDocument()
  })

  it('should render sparse decimals', () => {
    render(<RoundedBalance value="0.10000000001" ticker="USDC" />)
    expect(screen.getByText('0.10000… USDC')).toBeInTheDocument()
  })

  it('should render sparse whole number', () => {
    render(<RoundedBalance value="100.00000000001" ticker="USDC" />)
    expect(screen.getByText('100.00000… USDC')).toBeInTheDocument()
  })

  it('should render variant when rounded value is equal zero', () => {
    render(<RoundedBalance value="0.00000000000002231" ticker="USDC" />)
    expect(screen.getByText('< 0.00000 USDC')).toBeInTheDocument()
  })

  it('should not round value up', () => {
    render(<RoundedBalance value="0.004795600000000000" ticker="USDC" />)
    expect(screen.getByText('0.00479… USDC')).toBeInTheDocument()
  })

  it('should not round negative value up', () => {
    render(<RoundedBalance value="-0.004795600000000000" ticker="USDC" />)
    expect(screen.getByText('-0.00479… USDC')).toBeInTheDocument()
  })

  it('should render value with ROSE ticker symbol', () => {
    render(<RoundedBalance value="0.002231" ticker="ROSE" />)
    expect(screen.getByText('0.00223… ROSE')).toBeInTheDocument()
  })

  describe('should render large values', () => {
    it('whole number', () => {
      render(<RoundedBalance value="1111111111111111111111111111111111111111111111111111" ticker="ROSE" />)
      expect(
        screen.getByText('1,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111 ROSE'),
      ).toBeInTheDocument()
    })

    it('with decimals', () => {
      render(
        <RoundedBalance
          value="1111111111111111111111111111111111111111111111111111.00000000000002231"
          ticker="ROSE"
        />,
      )
      expect(
        screen.getByText('1,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111,111.00000… ROSE'),
      ).toBeInTheDocument()
    })

    it('without converting to sci notation', () => {
      render(<RoundedBalance value="1000000000000000000000000000000000000000000000000000" ticker="ROSE" />)
      expect(
        screen.getByText('1,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000 ROSE'),
      ).toBeInTheDocument()
    })
  })
})
