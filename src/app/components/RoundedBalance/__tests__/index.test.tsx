import { render, screen } from '@testing-library/react'
import { RoundedBalance } from './../'
import { MemoryRouter } from 'react-router-dom'
import util from 'util'

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

  describe('should format large numbers with i18next when compactLargeNumbers prop is true', () => {
    it('should format large number', () => {
      render(<RoundedBalance compactLargeNumbers value="15000000" />)
      expect(screen.getByText('15M')).toBeInTheDocument()
    })

    it('should format large number and include ticker', () => {
      render(<RoundedBalance compactLargeNumbers value="15000000" ticker="ROSE" />)
      expect(screen.getByText('15M ROSE')).toBeInTheDocument()
    })

    it('should format large number with decimals', () => {
      render(<RoundedBalance compactLargeNumbers value="100000.00000000000002231" />)
      expect(screen.getByText('100K')).toBeInTheDocument()
    })

    it('should not format if number is too small', () => {
      render(<RoundedBalance compactLargeNumbers value="99999.00000000000002231" />)
      expect(screen.getByText('99,999.00000…')).toBeInTheDocument()
    })
  })

  for (const compactLargeNumbers of [false, true]) {
    for (const showSign of [false, true]) {
      for (const tickerAsLink of [false, true]) {
        for (const ticker of [undefined, 'wROSE']) {
          for (const tokenAddress of [undefined, '0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3']) {
            for (const value of ['-0.0047956', '0.00000000000002231', '0.002231', '5', '15000000']) {
              const params = { compactLargeNumbers, showSign, tickerAsLink, ticker, tokenAddress, value }
              it(`should match snapshot ${util.inspect(params)}`, () => {
                const { container } = render(
                  <MemoryRouter>
                    <RoundedBalance {...params} scope={{ layer: 'sapphire', network: 'mainnet' }} />
                  </MemoryRouter>,
                )
                const txt = `${container.textContent} ${container.querySelector('a')?.href ?? ''}`
                expect(txt).toMatchSnapshot()

                if (tickerAsLink && tokenAddress) {
                  expect(txt).toContain('http')
                } else {
                  expect(txt).not.toContain('http')
                }

                if (showSign) {
                  expect(txt).toMatch(/^[<\-+]/)
                } else {
                  expect(txt).toMatch(/^[<\-\d]/)
                }

                if (compactLargeNumbers && value === '15000000') {
                  expect(txt).toContain('M')
                } else {
                  expect(txt).not.toContain('M')
                }
              })
            }
          }
        }
      }
    }
  }
})
