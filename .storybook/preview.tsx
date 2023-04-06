import React from 'react'
import { Preview } from '@storybook/react'
import { defaultTheme } from '../src/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '../src/locales/i18n'

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

export default preview
