import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { withDefaultTheme } from '../components/ThemeByNetwork'
import React from 'react'
import { useIsApiReachable, useRuntimeFreshness } from '../components/OfflineBanner/hook'

jest.mock('../components/OfflineBanner/hook')

export function renderWithProviders(component: React.ReactElement) {
  // We need to disable API offline checks
  jest.mocked(useIsApiReachable).mockReturnValue({ reachable: true, latestNodeBlock: 1000 })
  jest.mocked(useRuntimeFreshness).mockReturnValue({ outOfDate: false })

  // And then we can run code
  return render(component, {
    wrapper: ({ children }) => withDefaultTheme(<MemoryRouter>{children}</MemoryRouter>),
  })
}
