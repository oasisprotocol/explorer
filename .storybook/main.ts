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
    '@storybook/addon-webpack5-compiler-babel',
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
      ...(options.presets || []), // In Storybook 8 presets are not provided
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
        ['@babel/preset-react', { runtime: 'automatic' }],
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
          'app/utils': path.resolve(appSource, 'utils'),
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
