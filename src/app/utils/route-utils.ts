import { LoaderFunctionArgs } from 'react-router-dom'
import { isValidTxHash } from './helpers'
import { isValidBlockHeight, isValidOasisAddress, isValidEthAddress } from './helpers'
import { AppError, AppErrors } from '../../types/errors'
import { EvmTokenType, Layer } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { SearchScope } from '../../types/searchScope'
import { isStableDeploy } from '../../config'

export type SpecifiedPerEnabledLayer<T = any, ExcludeLayers = never> = {
  [N in keyof (typeof RouteUtils)['ENABLED_LAYERS_FOR_NETWORK']]: {
    [L in keyof (typeof RouteUtils)['ENABLED_LAYERS_FOR_NETWORK'][N] as Exclude<
      L,
      ExcludeLayers
    >]: (typeof RouteUtils)['ENABLED_LAYERS_FOR_NETWORK'][N][L] extends true ? T : T | undefined
  }
}

export type SpecifiedPerEnabledRuntime<T = any> = SpecifiedPerEnabledLayer<T, typeof Layer.consensus>

export abstract class RouteUtils {
  private static ENABLED_LAYERS_FOR_NETWORK = {
    [Network.mainnet]: {
      [Layer.emerald]: true,
      [Layer.sapphire]: true,
      [Layer.cipher]: false,
      // Disable WIP Consensus on production an staging
      [Layer.consensus]: !isStableDeploy,
    },
    [Network.testnet]: {
      [Layer.emerald]: true,
      [Layer.sapphire]: true,
      [Layer.cipher]: false,
      [Layer.consensus]: false,
    },
  } satisfies Record<Network, Record<Layer, boolean>>

  static getDashboardRoute = ({ network, layer }: SearchScope) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}`
  }

  static getLatestTransactionsRoute = ({ network, layer }: SearchScope) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/tx`
  }

  static getTopTokensRoute = ({ network, layer }: SearchScope) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/token`
  }

  static getLatestBlocksRoute = ({ network, layer }: SearchScope) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/block`
  }

  static getBlockRoute = ({ network, layer }: SearchScope, blockHeight: number) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/block/${encodeURIComponent(
      blockHeight,
    )}`
  }

  static getTransactionRoute = (scope: SearchScope, txHash: string) => {
    return `/${encodeURIComponent(scope.network)}/${encodeURIComponent(scope.layer)}/tx/${encodeURIComponent(
      txHash,
    )}`
  }

  static getAccountRoute = ({ network, layer }: SearchScope, account: string) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/address/${encodeURIComponent(
      account,
    )}`
  }

  static getAccountTokensRoute = (
    scope: SearchScope,
    account: string,
    tokenType: EvmTokenType,
    tokenAddress: string | undefined,
  ) => {
    const map: Record<EvmTokenType, string | undefined> = {
      ERC20: `${this.getAccountRoute(scope, account)}/tokens/erc-20`,
      ERC721: `${this.getAccountRoute(scope, account)}/tokens/erc-721`,
    }
    const tokenRoutes = map[tokenType]
    if (!tokenRoutes) throw new Error('Unexpected token type')
    return tokenAddress ? `${tokenRoutes}#${encodeURIComponent(tokenAddress)}` : tokenRoutes
  }

  static getSearchRoute = (scope: SearchScope | undefined, searchTerm: string) => {
    return scope
      ? `/${scope.network}/${scope.layer}/search?q=${encodeURIComponent(searchTerm)}`
      : `/search?q=${encodeURIComponent(searchTerm)}`
  }

  static getTokenRoute = ({ network, layer }: SearchScope, tokenAddress: string) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/token/${encodeURIComponent(
      tokenAddress,
    )}`
  }

  static getTokenHoldersRoute = ({ network, layer }: SearchScope, tokenAddress: string) => {
    return `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/token/${encodeURIComponent(
      tokenAddress,
    )}/holders`
  }

  static getNFTInstanceRoute = (
    { network, layer }: SearchScope,
    contractAddress: string,
    instanceId: string,
  ): string =>
    `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}/token/${encodeURIComponent(
      contractAddress,
    )}/instance/${encodeURIComponent(instanceId)}`

  static getEnabledLayersForNetwork(network: Network): Layer[] {
    return Object.values(Layer).filter(layer => RouteUtils.ENABLED_LAYERS_FOR_NETWORK[network][layer])
  }

  static getEnabledScopes(): SearchScope[] {
    return RouteUtils.getEnabledNetworks().flatMap(network =>
      RouteUtils.getEnabledLayersForNetwork(network).map(layer => ({ network, layer })),
    )
  }

  static getEnabledNetworks(): Network[] {
    return Object.values(Network).filter(network => {
      return RouteUtils.getEnabledLayersForNetwork(network).length > 0
    })
  }

  static getEnabledSearchScopes(): SearchScope[] {
    return RouteUtils.getEnabledNetworks().flatMap(network =>
      RouteUtils.getEnabledLayersForNetwork(network).map(layer => ({ network, layer })),
    )
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
export type AddressLoaderData = {
  address: string
}

export const addressParamLoader =
  (queryParam: string = 'address') =>
  ({ params }: LoaderFunctionArgs): AddressLoaderData => {
    validateAddressParam(params[queryParam]!)
    console.log('Returning address data based on ', params)
    return {
      address: params[queryParam]!,
    }
  }

export const blockHeightParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateBlockHeightParam(params.blockHeight!)
}

export const transactionParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateTxHashParam(params.hash!)
}

export const assertEnabledScope = ({
  network,
  layer,
}: {
  network: string | undefined
  layer: string | undefined
}): SearchScope => {
  if (!network || !RouteUtils.getEnabledNetworks().includes(network as Network)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  if (
    !layer || // missing param
    !RouteUtils.getEnabledLayersForNetwork(network as Network).includes(layer as Layer) // unsupported on network
  ) {
    throw new AppError(AppErrors.UnsupportedLayer)
  }
  return { network, layer } as SearchScope
}
