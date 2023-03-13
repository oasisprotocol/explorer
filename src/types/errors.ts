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
  UnsupportedLayer = 'unsupported_layer',
  InvalidAddress = 'invalid_address',
  InvalidBlockHeight = 'invalid_block_height',
  InvalidTxHash = 'invalid_tx_hash',
  InvalidPageNumber = 'invalid_page_number',
  NotFoundBlockHeight = 'not_found_block_height',
  NotFoundTxHash = 'not_found_tx_hash',
  InvalidUrl = 'invalid_url',
}

export interface ErrorPayload {
  code: AppErrors
  message: string
}
