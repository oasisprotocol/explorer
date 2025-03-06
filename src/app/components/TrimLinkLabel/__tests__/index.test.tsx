import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/__tests__/renderWithProviders.test'
import { TrimLinkLabel, TrimEndLinkLabel } from '..'

test('TrimLinkLabel snapshot', () => {
  const { container } = renderWithProviders(
    <TrimLinkLabel label="oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4" to="/home" />,
  )
  expect(container).toMatchSnapshot()
})

describe('TrimEndLinkLabel', () => {
  test('should trim long name', () => {
    renderWithProviders(<TrimEndLinkLabel label="P2P.ORG - P2P Validator" to="/home" trimStart={14} />)
    expect(screen.getByText('P2P.ORG - P2P …')).toBeInTheDocument()
  })

  test('should not trim short names', () => {
    renderWithProviders(<TrimEndLinkLabel label="BinanceStaking" to="/home" trimStart={14} />)
    expect(screen.getByText('BinanceStaking')).toBeInTheDocument()
  })
})
