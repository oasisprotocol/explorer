import prependNetworkPath from './prependNetworkPath.js'
import removeNetworkFromName from './removeNetworkFromName.js'

/** @type {import('@orval/core').Config} */
const config = {
  nexus: {
    input: {
      // target: './v1.yaml',
      // target: 'https://raw.githubusercontent.com/oasisprotocol/nexus/main/api/spec/v1.yaml',
      target:
        'https://raw.githubusercontent.com/oasisprotocol/nexus/pro-wh/feature/holders13/api/spec/v1.yaml',
      // target: 'https://nexus.stg.oasis.io/v1/spec/v1.yaml',
      // target: 'https://nexus.oasis.io/v1/spec/v1.yaml',
      override: {
        // We want:
        // - network as a parameter for controlling API baseURL
        // - network in queryKey
        // We don't want:
        // - network parameter to be sent to API
        // - network in operation names
        transformer: prependNetworkPath,
      },
    },
    output: {
      target: './generated/api.ts',
      client: 'react-query',
      mode: 'single',
      override: {
        operationName: removeNetworkFromName,
        mutator: './replaceNetworkWithBaseURL.ts',
      },
    },
  },
}

module.exports = config
