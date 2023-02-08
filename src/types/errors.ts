export class AppError extends Error {
  constructor(public readonly type: AppErrors, message?: string, public readonly originalError?: Error) {
    super(message)
  }
}

export enum AppErrors {
  Unknown = 'unknown',
  InvalidAddress = 'invalid_address',
  InvalidBlockHeight = 'invalid_block_height',
  InvalidTxHash = 'invalid_tx_hash',
}

export interface ErrorPayload {
  code: AppErrors
  message: string
}
