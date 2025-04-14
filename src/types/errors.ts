export class AppError extends Error {
  public readonly type: AppErrors
  public readonly originalError?: Error
  constructor(type: AppErrors, message?: string, originalError?: Error) {
    super(message ?? type)
    this.type = type
    this.originalError = originalError
  }
}

export enum AppErrors {
  Unknown = 'unknown',
  UnsupportedNetwork = 'unsupported_network',
  UnsupportedLayer = 'unsupported_layer',
  InvalidAddress = 'invalid_address',
  InvalidRoflAppId = 'invalid_rofl_app_id',
  InvalidBlockHeight = 'invalid_block_height',
  InvalidTxHash = 'invalid_tx_hash',
  InvalidProposalId = 'invalid_proposal_id',
  InvalidPageNumber = 'invalid_page_number',
  PageDoesNotExist = 'page_does_not_exist',
  NotFoundBlockHeight = 'not_found_block_height',
  NotFoundTxHash = 'not_found_tx_hash',
  NotFoundRoflApp = 'not_found_rofl_app',
  NotFoundRoflAppInstance = 'not_found_rofl_app_instance',
  NotFoundProposalId = 'not_found_proposal_id',
  InvalidUrl = 'invalid_url',
  InvalidVote = 'invalid_vote',
  Storage = 'storage',
}

export interface ErrorPayload {
  code: AppErrors
  message: string
}

// Adds strict type-check that a type was exhausted
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
// https://stackoverflow.com/questions/41102060/typescript-extending-error-class
export function exhaustedTypeWarning(
  messagePrefix: string,
  exhaustedType: 'Expected type to be exhausted, but this type was not handled',
) {
  const message = `${messagePrefix}: Expected type to be exhausted, but this type was not handled: ${JSON.stringify(
    exhaustedType,
  )}`
  if (process.env.NODE_ENV === 'production') {
    console.warn(message)
  } else {
    throw new Error(message)
  }
}
