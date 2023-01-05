// TODO: use /** @type {import('orval').Config} */ in next version
/** @type {Parameters<import('orval').defineConfig>[0]} */
module.exports = {
  indexer: {
    input: {
      // target: './v1.yaml',
      // target: 'https://raw.githubusercontent.com/oasisprotocol/oasis-indexer/main/api/spec/v1.yaml',
      // target: 'https://index-staging.oasislabs.com/v1/spec/v1.yaml',
      target: 'https://index.oasislabs.com/v1/spec/v1.yaml',
    },
    output: {
      target: './generated/api.ts',
      client: 'react-query',
      mode: 'single',
    },
  },
};
