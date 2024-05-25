import * as fs from 'fs'
import prependNetworkPath from './prependNetworkPath.js'
import removeNetworkFromName from './removeNetworkFromName.js'

/** @type {import('@orval/core').Config} */
const config = {
  nexus: {
    input: {
      // target: './v1.yaml',
      target: 'https://raw.githubusercontent.com/oasisprotocol/nexus/main/api/spec/v1.yaml',
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
      urlEncodeParameters: true,
      override: {
        operationName: removeNetworkFromName,
        mutator: './replaceNetworkWithBaseURL.ts',
      },
    },
    hooks: {
      afterAllFilesWrite: async filesPaths => {
        for (const filePath of filesPaths) {
          const generatedApiFile = await fs.promises.readFile(filePath, 'utf-8')

          const patchedApiFile = generatedApiFile
            .replace(
              'export type EthOrOasisAddress = string;',
              /* eslint-disable no-template-curly-in-string */
              [
                'export type EthOrOasisAddress = OasisAddress | EthAddress; /* modified by afterAllFilesWrite */\n',
                'export type OasisAddress = `oasis1${string}`; /* modified by afterAllFilesWrite */\n',
                'export type EthAddress = `0x${string}`; /* modified by afterAllFilesWrite */\n',
              ].join(''),
              /* eslint-enable no-template-curly-in-string */
            )
            .replace(
              'export type StakingAddress = string;',
              'export type StakingAddress = OasisAddress; /* modified by afterAllFilesWrite */',
            )
            .replace(
              'export type Address = string;',
              'export type Address = OasisAddress; /* modified by afterAllFilesWrite */',
            )
            .replaceAll('DEPRECATED:', '@deprecated (modified by afterAllFilesWrite)')

          await fs.promises.writeFile(filePath, patchedApiFile, 'utf-8')
        }
      },
    },
  },
}

module.exports = config
