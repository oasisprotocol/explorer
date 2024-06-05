import React from 'react'
import { Preview } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '../src/locales/i18n'
import { withDefaultTheme } from '../src/app/components/ThemeByScope'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { handlers } from '../internals/mocks/msw-handlers'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

initialize({
  onUnhandledRequest: 'bypass',
})

const preview: Preview = {
  decorators: [
    Story => <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>,
    Story => withDefaultTheme(<Story />),
  ],
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers,
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

export default preview
