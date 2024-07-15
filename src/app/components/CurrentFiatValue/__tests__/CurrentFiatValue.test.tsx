import { screen, render } from '@testing-library/react'
import { CurrentFiatValue } from '..'

describe('CurrentFiatValue', () => {
  it('should display formatted values', () => {
    render(
      <CurrentFiatValue
        hasUsedCoinGecko={true}
        amount="1000000000100000000010000000001000000000.10000000001"
        price={0.55555}
        fiatCurrency="usd"
      />,
    )
    expect(screen.getByText('$555,550,000,055,555,000,005,555,500,000,555,550,000.06')).toBeInTheDocument()
    expect(screen.getByText('CoinGecko')).toBeInTheDocument()
  })
})
