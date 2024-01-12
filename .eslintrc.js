// @ts-check

/** @type { import('eslint').Linter.Config } */
const config = {
  extends: [
    'eslint:recommended', // https://eslint.org/docs/rules/
    'plugin:react/recommended', // https://github.com/jsx-eslint/eslint-plugin-react#list-of-supported-rules
    'plugin:@typescript-eslint/recommended', // https://typescript-eslint.io/rules/
    'react-app', // https://github.com/facebook/create-react-app/blob/main/packages/eslint-config-react-app/index.js
    'plugin:prettier/recommended', // See .prettierrc
  ],
  parser: '@typescript-eslint/parser',

  settings: {},
  reportUnusedDisableDirectives: true,

  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/material',
            message: "Use '@mui/material/*' instead.",
          },
          {
            name: '@mui/icons-material',
            message: "Use '@mui/icons-material/*' instead.",
          },
        ],
        patterns: [
          {
            group: ['@mui/system', '@emotion/styled'],
            message: "Use '@mui/material/styles' instead.",
          },
          {
            group: ['**/oasis-nexus/generated/api'],
            message: "Import 'oasis-nexus/api' instead.",
          },
        ],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'MemberExpression[object.object.name="process"][object.property.name="env"][property.name="REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS"]',
        message:
          'Replace with window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS to support overriding in e2e tests',
      },
    ],
    'prefer-template': 'error',

    'react/jsx-no-target-blank': 'off', // Not needed with modern browsers
    'react/react-in-jsx-scope': 'off', // Not needed after React v17
    'react/display-name': 'off', // TODO: Maybe enable
    'react/self-closing-comp': ['error', { component: true, html: true }],

    '@typescript-eslint/no-empty-function': 'off', // Allow empty reducers for saga
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // TODO: Maybe enable
    '@typescript-eslint/no-empty-interface': 'off', // TODO: Enable. Empty interfaces aren't safe (equivalent to "any")
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': 'warn' },
    },
    {
      files: ['internals/**'],
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
    {
      files: ['**/*.js'],
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
  ],
}

module.exports = config
