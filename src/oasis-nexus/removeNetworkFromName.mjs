import { getOperationId } from '@orval/core'

/** @type {import('@orval/core').OverrideOutput['operationName']} */
const removeNetworkFromName = (operation, route, verb) => {
  // eslint-disable-next-line no-template-curly-in-string
  return getOperationId(operation, route.replace('/${network}', ''), verb)
}

export default removeNetworkFromName
