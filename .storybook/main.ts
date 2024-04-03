import path from 'path'
import type { StorybookConfig } from '@storybook/react-webpack5'

const appSource = path.resolve(__dirname, '../src/app')

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['./public'],
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
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'app/hooks': path.resolve(appSource, 'hooks'),
          'app/components': path.resolve(appSource, 'components'),
        },
      },
      module: {
        ...config.module,
        unknownContextCritical: false,
      },
    }
  },
}
export default config
