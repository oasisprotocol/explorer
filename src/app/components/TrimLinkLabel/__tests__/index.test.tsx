import { TrimLinkLabel } from '..'
import { renderWithProviders } from '../../../utils/renderWithProviders'

test('TrimLinkLabel snapshot', () => {
  const { container } = renderWithProviders(
    <TrimLinkLabel label="oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4" to="/home" />,
  )
  expect(container).toMatchSnapshot()
})
