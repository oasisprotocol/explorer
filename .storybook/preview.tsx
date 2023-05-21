import React from 'react'
import { Preview } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '../src/locales/i18n'
import { withDefaultTheme } from '../src/app/components/ThemeByNetwork'

const preview: Preview = {
  decorators: [Story => withDefaultTheme(<Story />)],
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
