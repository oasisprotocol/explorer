import { defaultTheme } from '../src/styles/theme'
import { ThemeProvider } from '@mui/material/styles'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

import '../src/locales/i18n'

export const decorators = [
  Story => (
    <ThemeProvider theme={defaultTheme}>
      <Story />
    </ThemeProvider>
  ),
]
