import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TrimLinkLabel } from '..'

test('TrimLinkLabel snapshot', () => {
  const { container } = render(
    <MemoryRouter>
      <TrimLinkLabel label="oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4" to="/home" />
    </MemoryRouter>,
  )
  expect(container).toMatchSnapshot()
})
