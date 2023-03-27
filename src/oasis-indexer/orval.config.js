/** @type {import('@orval/core').Config} */
module.exports = {
  indexer: {
    input: {
      // target: './v1.yaml',
      // target: 'https://raw.githubusercontent.com/oasisprotocol/oasis-indexer/main/api/spec/v1.yaml',
      target: 'https://index-staging.oasislabs.com/v1/spec/v1.yaml',
      // target: 'https://index.oasislabs.com/v1/spec/v1.yaml',
    },
    output: {
      target: './generated/api.ts',
      client: 'react-query',
      mode: 'single',
    },
  },
}
