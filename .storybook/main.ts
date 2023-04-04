import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-react-router-v6',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
  },
  babel: async options => ({
    ...options,
    presets: [
      ...options.presets!,
      ...[
        [
          '@babel/preset-env',
          {
            targets: {
              chrome: 100,
            },
          },
        ],
        '@babel/preset-typescript',
      ],
    ],
  }),
  docs: {
    autodocs: true,
  },
  webpackFinal: async config => {
    return {
      ...config,
      module: {
        ...config.module,
        unknownContextCritical: false,
      },
    }
  },
}
export default config
