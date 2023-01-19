import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { defaultTheme } from '../../styles/theme'
import { render } from '@testing-library/react'

export function renderWithProviders(component: React.ReactElement) {
  return render(component, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    ),
  })
}
