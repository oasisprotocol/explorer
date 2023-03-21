import { LoaderFunctionArgs } from 'react-router-dom'
import { getOasisAddress, isValidTxHash } from './helpers'
import { isValidBlockHeight, isValidOasisAddress, isValidEthAddress } from './helpers'
import { AppError, AppErrors } from '../../types/errors'
import { EvmTokenType, Layer } from '../../oasis-indexer/api'

export abstract class RouteUtils {
  private static ENABLED_LAYERS: Layer[] = [Layer.emerald, Layer.sapphire]

  static getDashboardRoute = (layer: Layer) => {
    return `/${encodeURIComponent(layer)}`
  }

  static getLatestTransactionsRoute = (layer: Layer) => {
    return `/${encodeURIComponent(layer)}/transactions`
  }

  static getLatestBlocksRoute = (layer: Layer) => {
    return `/${encodeURIComponent(layer)}/blocks`
  }

  static getBlockRoute = (blockHeight: number, layer: Layer) => {
    return `/${encodeURIComponent(layer)}/blocks/${encodeURIComponent(blockHeight)}`
  }

  static getTransactionRoute = (txHash: string, layer: Layer) => {
    return `/${encodeURIComponent(layer)}/transactions/${encodeURIComponent(txHash)}`
  }

  static getAccountRoute = (sender: string, layer: Layer) => {
    return `/${encodeURIComponent(layer)}/account/${encodeURIComponent(sender)}`
  }

  static getAccountTokensRoute = (
    sender: string,
    layer: Layer,
    tokenType: EvmTokenType,
    tokenAddress: string | undefined,
  ) => {
    const map: Record<EvmTokenType, string | undefined> = {
      ERC20: `${this.getAccountRoute(sender, layer)}/tokens/erc-20`,
      ERC721: `${this.getAccountRoute(sender, layer)}/tokens/erc-721`,
      ERC1155: undefined,
      OasisSdk: undefined,
    }
    const tokenRoutes = map[tokenType]
    if (!tokenRoutes) throw new Error('Unexpected token type')
    return tokenAddress ? `${tokenRoutes}#${encodeURIComponent(tokenAddress)}` : tokenRoutes
  }

  static getSearchRoute = (searchTerm: string) => {
    return `/search?q=${encodeURIComponent(searchTerm)}`
  }

  static getEnabledLayers(): Layer[] {
    return RouteUtils.ENABLED_LAYERS
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
  // TODO: remove conversion when API supports querying by EVM address
  const address = await getOasisAddress(params.address!)
  return address
}

export const blockHeightParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateBlockHeightParam(params.blockHeight!)
}

export const transactionParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateTxHashParam(params.hash!)
}

export const layerLoader = async (args: LoaderFunctionArgs) => {
  const {
    params: { layer },
  } = args

  if (!layer || !RouteUtils.getEnabledLayers().includes(layer as Layer)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  return true
}
