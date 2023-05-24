import { LoaderFunctionArgs } from 'react-router-dom'
import { getOasisAddress, isValidTxHash } from './helpers'
import { isValidBlockHeight, isValidOasisAddress, isValidEthAddress } from './helpers'
import { AppError, AppErrors } from '../../types/errors'
import { EvmTokenType, Layer } from '../../oasis-indexer/api'
import { Network } from '../../types/network'

export abstract class RouteUtils {
  private static ENABLED_LAYERS: Layer[] = [Layer.emerald, Layer.sapphire]

  private static ENABLED_NETWORKS: Network[] = [Network.mainnet, Network.testnet]

  static getDashboardRoute = (network: Network, layer: Layer) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}`
  }

  static getLatestTransactionsRoute = (network: Network, layer: Layer) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/transactions`
  }

  static getLatestBlocksRoute = (network: Network, layer: Layer) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/blocks`
  }

  static getBlockRoute = (network: Network, blockHeight: number, layer: Layer) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/blocks/${encodeURIComponent(
      blockHeight,
    )}`
  }

  static getTransactionRoute = (network: Network, txHash: string, layer: Layer) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/transactions/${encodeURIComponent(
      txHash,
    )}`
  }

  static getAccountRoute = (network: Network, account: string, layer: Layer) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/account/${encodeURIComponent(
      account,
    )}`
  }

  static getAccountTokensRoute = (
    network: Network,
    account: string,
    layer: Layer,
    tokenType: EvmTokenType,
    tokenAddress: string | undefined,
  ) => {
    const map: Record<EvmTokenType, string | undefined> = {
      ERC20: `${this.getAccountRoute(network, account, layer)}/tokens/erc-20`,
      ERC721: `${this.getAccountRoute(network, account, layer)}/tokens/erc-721`,
      ERC1155: undefined,
      OasisSdk: undefined,
    }
    const tokenRoutes = map[tokenType]
    if (!tokenRoutes) throw new Error('Unexpected token type')
    return tokenAddress ? `${tokenRoutes}#${encodeURIComponent(tokenAddress)}` : tokenRoutes
  }

  static getSearchRoute = (network: Network | undefined, searchTerm: string) => {
    return network
      ? `/${network}/search?q=${encodeURIComponent(searchTerm)}`
      : `/search?q=${encodeURIComponent(searchTerm)}`
  }

  static getEnabledLayers(): Layer[] {
    return RouteUtils.ENABLED_LAYERS
  }

  static getEnabledNetworks(): Network[] {
    return RouteUtils.ENABLED_NETWORKS
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

export const networkLoader = async (args: LoaderFunctionArgs) => {
  const {
    params: { network },
  } = args

  if (!network || !RouteUtils.getEnabledNetworks().includes(network as Network)) {
    console.log('Error: invalid network', network)
    throw new AppError(AppErrors.InvalidUrl)
  }

  return true
}

export const layerLoader = async (args: LoaderFunctionArgs) => {
  const {
    params: { layer, network },
  } = args

  if (!network || !layer || !RouteUtils.getEnabledLayers().includes(layer as Layer)) {
    console.log('Error: invalid layer', layer)
    throw new AppError(AppErrors.InvalidUrl)
  }

  return true
}
