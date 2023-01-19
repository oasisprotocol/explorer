// @ts-check
// https://jestjs.io/docs/configuration#defaults

/** @type {import('ts-jest').JestConfigWithTsJest} */
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
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': ['ts-jest', {
      // Disable typechecking to speedup tests. We have `yarn checkTs`.
      isolatedModules: true,
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(cborg)/)',
  ],
}

module.exports = config
