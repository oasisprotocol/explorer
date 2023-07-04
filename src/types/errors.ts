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
  InvalidBlockHeight = 'invalid_block_height',
  InvalidTxHash = 'invalid_tx_hash',
  InvalidPageNumber = 'invalid_page_number',
  NotFoundBlockHeight = 'not_found_block_height',
  NotFoundTxHash = 'not_found_tx_hash',
  InvalidUrl = 'invalid_url',
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
