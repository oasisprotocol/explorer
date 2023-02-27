import { LoaderFunctionArgs } from 'react-router-dom'
import { ParaTime } from '../../config'
import { getOasisAddress, isValidTxHash } from './helpers'
import { isValidBlockHeight, isValidOasisAddress, isValidEthAddress } from './helpers'
import { AppError, AppErrors } from '../../types/errors'

export abstract class RouteUtils {
  private static ENABLED_PARA_TIMES: ParaTime[] = [ParaTime.Emerald, ParaTime.Sapphire, ParaTime.Cipher]

  static getDashboardRoute = (paraTime: ParaTime) => {
    return `/${paraTime}`
  }

  static getLatestTransactionsRoute = (paraTime: ParaTime) => {
    return `/${paraTime}/transactions`
  }

  static getLatestBlocksRoute = (paraTime: ParaTime) => {
    return `/${paraTime}/blocks`
  }

  static getBlockRoute = (blockHeight: number, paraTime: ParaTime | null = null) => {
    return `${paraTime ? `/${paraTime}` : ''}/blocks/${encodeURIComponent(blockHeight)}`
  }

  static getTransactionRoute = (txHash: string, paraTime: ParaTime | null = null) => {
    return `${paraTime ? `/${paraTime}` : ''}/transactions/${encodeURIComponent(txHash)}`
  }

  static getAccountRoute = (sender: string, paraTime: ParaTime | null = null) => {
    return `${paraTime ? `/${paraTime}` : ''}/account/${encodeURIComponent(sender)}`
  }

  static getEnabledParaTimes(): ParaTime[] {
    return RouteUtils.ENABLED_PARA_TIMES
  }
}

const validateAddressParam = (address: string) => {
  const isValid = isValidOasisAddress(address) || isValidEthAddress(address)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidAddress)
  }

  return isValid
}

const validateBlockHeightParam = (blockHeight: string) => {
  const isValid = isValidBlockHeight(blockHeight)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidBlockHeight)
  }

  return isValid
}

const validateTxHashParam = (hash: string) => {
  const isValid = isValidTxHash(hash)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidTxHash)
  }
  return true
}

export const addressParamLoader = async ({ params }: LoaderFunctionArgs) => {
  validateAddressParam(params.address!)
  const address = await getOasisAddress(params.address!)
  return address
}

export const blockHeightParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateBlockHeightParam(params.blockHeight!)
}

export const transactionParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateTxHashParam(params.hash!)
}

export const paraTimeLoader = async (
  args: LoaderFunctionArgs,
  next?: (args: LoaderFunctionArgs) => Promise<string | boolean>,
) => {
  const {
    params: { paraTime },
  } = args

  if (!paraTime || !RouteUtils.getEnabledParaTimes().includes(paraTime as ParaTime)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  if (next) {
    return await next(args)
  }

  return true
}
