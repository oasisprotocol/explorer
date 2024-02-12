import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/renderWithProviders'
import { TrimLinkLabel, TrimLinkNameLabel } from '..'

test('TrimLinkLabel snapshot', () => {
  const { container } = renderWithProviders(
    <TrimLinkLabel label="oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4" to="/home" />,
  )
  expect(container).toMatchSnapshot()
})

describe('TrimLinkNameLabel', () => {
  test('should trim long name', () => {
    renderWithProviders(<TrimLinkNameLabel label="P2P.ORG - P2P Validator" to="/home" />)
    expect(screen.getByText('P2P.ORG - P2P …')).toBeInTheDocument()
  })

  test('should not trim short names', () => {
    renderWithProviders(<TrimLinkNameLabel label="BinanceStaking" to="/home" />)
    expect(screen.getByText('BinanceStaking')).toBeInTheDocument()
  })
})
