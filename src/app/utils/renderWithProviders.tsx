import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { withDefaultTheme } from '../components/ThemeByNetwork'
import React from 'react'
import { useIsApiOffline, useRuntimeFreshness } from '../components/OfflineBanner/hook'

jest.mock('../components/OfflineBanner/hook')

export function renderWithProviders(component: React.ReactElement) {
  // We need to disable API offline checks
  jest.mocked(useIsApiOffline).mockReturnValue(false)
  jest.mocked(useRuntimeFreshness).mockReturnValue({ outOfDate: false })

  // And then we can run code
  return render(component, {
    wrapper: ({ children }) => withDefaultTheme(<MemoryRouter>{children}</MemoryRouter>),
  })
}
