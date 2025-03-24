/**
 * Input transformer function for orval.
 * Adjusted from https://github.com/anymaniax/orval/blob/64070a6/samples/basic/api/transformer/add-version.js
 *
 * @param {import('openapi3-ts').OpenAPIObject} inputSchema
 * @return {import('openapi3-ts').OpenAPIObject}
 */
const prependNetworkPath = inputSchema => ({
  ...inputSchema,
  paths: Object.entries(inputSchema.paths).reduce(
    (acc, [path, pathItem]) => ({
      ...acc,
      [`/{network}${path}`]: Object.entries(pathItem).reduce(
        (pathItemAcc, [verb, operation]) => ({
          ...pathItemAcc,
          [verb]: {
            ...operation,
            parameters: [
              ...(operation.parameters ?? []),
              {
                in: 'path',
                name: 'network',
                required: true,
                schema: {
                  type: 'string',
                  enum: ['mainnet', 'testnet', 'localnet'],
                },
              },
            ],
          },
        }),
        {},
      ),
    }),
    {},
  ),
})

export default prependNetworkPath
