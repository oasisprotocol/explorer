// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  rootDir: './',
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>internals/jest/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>internals/jest/mocks/image.js',
  },
  clearMocks: true,
  resetMocks: true,
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/internals/jest/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/internals/jest/babelTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@ledgerhq/hw-transport-webusb|cborg|grommet/es6|grommet-icons/es6)/)',
  ],
}

module.exports = config
