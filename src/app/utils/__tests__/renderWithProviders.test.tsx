import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { withDefaultTheme } from '../../components/ThemeByScope'
import React from 'react'
import { useIsApiReachable, useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { LocalSettingsContextProvider } from '../../providers/LocalSettingsProvider'

jest.mock('../../components/OfflineBanner/hook')

export function renderWithProviders(component: React.ReactElement) {
  // We need to disable API offline checks
  jest.mocked(useIsApiReachable).mockReturnValue({ reachable: true })
  jest.mocked(useRuntimeFreshness).mockReturnValue({ outOfDate: false })

  // And then we can run code
  return render(component, {
    wrapper: ({ children }) =>
      withDefaultTheme(
        <LocalSettingsContextProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </LocalSettingsContextProvider>,
      ),
  })
}

describe('renderWithProviders', () => {
  it('should render without crashing', () => {
    expect(() => {
      renderWithProviders(<div>Test</div>)
    }).not.toThrow()
  })
})
