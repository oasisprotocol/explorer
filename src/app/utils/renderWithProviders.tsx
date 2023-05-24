import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { withDefaultTheme } from '../components/ThemeByNetwork'
import React from 'react'

export function renderWithProviders(component: React.ReactElement) {
  return render(component, {
    wrapper: ({ children }) => withDefaultTheme(<MemoryRouter>{children}</MemoryRouter>),
  })
}
