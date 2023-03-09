// @ts-check

/** @type { import('@storybook/core-common').StorybookConfig } */
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-react-router-v6',
    '@storybook/addon-viewport',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
    disableTelemetry: true,
    enableCrashReports: false,
  },
  features: {
    emotionAlias: false,
  },
  async webpackFinal(config) {
    config.resolve = config.resolve ?? {}
    // @ts-expect-error Incorrectly uses webpack4 types
    config.resolve.fallback = { "stream": false }
    return config
  }
}
