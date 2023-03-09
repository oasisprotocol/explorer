import { defaultTheme } from '../src/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '../src/locales/i18n'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
}

export const decorators = [
  Story => (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  ),
]
