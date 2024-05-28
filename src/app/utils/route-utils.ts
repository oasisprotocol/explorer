import { LoaderFunctionArgs } from 'react-router-dom'
import { isValidProposalId, isValidTxHash, isValidTxOasisHash } from './helpers'
import { isValidBlockHeight, isValidOasisAddress, isValidEthAddress } from './helpers'
import { AppError, AppErrors } from '../../types/errors'
import { EvmTokenType, Layer } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { SearchScope } from '../../types/searchScope'
import { isStableDeploy } from '../../config'
import { getSearchTermFromRequest } from '../components/Search/search-utils'
import { isLayerHidden } from '../../types/layers'

export const fixedNetwork = process.env.REACT_APP_FIXED_NETWORK as Network | undefined
export const fixedLayer = process.env.REACT_APP_FIXED_LAYER as Layer | undefined

export type ScopeFreedom =
  | 'network' // We can select only the network
  | 'layer' // We can select only the layer
  | 'network-layer' // We can select both network and layer
  | 'none' // We can't select anything, everything is fixed

export const scopeFreedom: ScopeFreedom = fixedNetwork
  ? fixedLayer
    ? 'none'
    : 'layer'
  : fixedLayer
    ? 'network'
    : 'network-layer'

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
      [Layer.pontusx]: false,
      // Disable WIP Consensus on production and staging
      [Layer.consensus]: !isStableDeploy,
    },
    [Network.testnet]: {
      [Layer.emerald]: true,
      [Layer.sapphire]: true,
      [Layer.cipher]: false,
      [Layer.pontusx]: true,
      // Disable WIP Consensus on production and staging
      [Layer.consensus]: !isStableDeploy,
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

  static getAccountsRoute = (network: Network) => {
    return `/${encodeURIComponent(network)}/consensus/address`
  }

  static getValidatorsRoute = (network: Network) => {
    return `/${encodeURIComponent(network)}/consensus/validators`
  }

  static getValidatorRoute = (network: Network, address: string) => {
    return `/${encodeURIComponent(network)}/consensus/validators/${encodeURIComponent(address)}`
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
      ? `/${encodeURIComponent(scope.network)}/${encodeURIComponent(scope.layer)}/search?q=${encodeURIComponent(searchTerm)}`
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

  static getAllLayersForNetwork(network: Network): { enabled: Layer[]; disabled: Layer[] } {
    const enabled: Layer[] = []
    const disabled: Layer[] = []

    Object.values(Layer).forEach(layer => {
      if ((!fixedLayer || layer === fixedLayer) && RouteUtils.ENABLED_LAYERS_FOR_NETWORK[network][layer]) {
        enabled.push(layer)
      } else {
        disabled.push(layer)
      }
    })

    return {
      enabled,
      disabled,
    }
  }

  static getVisibleLayersForNetwork(network: Network, currentScope: SearchScope | undefined): Layer[] {
    return this.getAllLayersForNetwork(network).enabled.filter(
      layer => !isLayerHidden(layer) || layer === currentScope?.layer,
    )
  }

  static getProposalsRoute = (network: Network) => {
    return `/${encodeURIComponent(network)}/consensus/proposal`
  }

  static getProposalRoute = (network: Network, proposalId: string | number) => {
    return `/${encodeURIComponent(network)}/consensus/proposal/${encodeURIComponent(proposalId)}`
  }

  static getEnabledScopes(): SearchScope[] {
    return RouteUtils.getEnabledNetworks().flatMap(network =>
      RouteUtils.getAllLayersForNetwork(network).enabled.map(layer => ({ network, layer })),
    )
  }

  static getVisibleScopes(currentScope: SearchScope | undefined): SearchScope[] {
    return RouteUtils.getEnabledScopes().filter(
      ({ network, layer }) => !isLayerHidden(layer) || layer === currentScope?.layer,
    )
  }

  /**
   * Get the list of enabled networks.
   *
   * If this Explorer is fixed to a specific network, the only that network will be returned.
   * Furthermore, if this Explorer is fixed to a specific layer, only networks that support that layer are returned.
   */
  static getEnabledNetworks(): Network[] {
    const networks = fixedNetwork
      ? [fixedNetwork]
      : Object.values(Network).filter(network => {
          return this.getAllLayersForNetwork(network).enabled.length > 0
        })
    return fixedLayer
      ? networks.filter(network => {
          return this.getAllLayersForNetwork(network).enabled.includes(fixedLayer)
        })
      : networks
  }

  static getEnabledNetworksForLayer(layer: Layer | undefined): Network[] {
    const networks = this.getEnabledNetworks()
    return layer
      ? networks.filter(network => {
          return this.getAllLayersForNetwork(network).enabled.includes(layer)
        })
      : networks
  }
}

const validateConsensusAddressParam = (address: string) => {
  const isValid = isValidOasisAddress(address)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidAddress)
  }

  return isValid
}

const validateRuntimeAddressParam = (address: string) => {
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

const validateConsensusTxHashParam = (hash: string) => {
  const isValid = isValidTxOasisHash(hash)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidTxHash)
  }
  return true
}

const validateRuntimeTxHashParam = (hash: string) => {
  const isValid = isValidTxHash(hash)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidTxHash)
  }
  return true
}

export type AddressLoaderData = {
  address: string
  searchTerm: string
}

const validateProposalIdParam = (proposalId: string) => {
  const isValid = isValidProposalId(proposalId)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidProposalId)
  }

  return isValid
}

export const consensusAddressParamLoader =
  (queryParam: string = 'address') =>
  ({ params, request }: LoaderFunctionArgs): AddressLoaderData => {
    validateConsensusAddressParam(params[queryParam]!)
    return {
      address: params[queryParam]!,
      searchTerm: getSearchTermFromRequest(request),
    }
  }

export const runtimeAddressParamLoader =
  (queryParam: string = 'address') =>
  ({ params, request }: LoaderFunctionArgs): AddressLoaderData => {
    validateRuntimeAddressParam(params[queryParam]!)
    return {
      address: params[queryParam]!,
      searchTerm: getSearchTermFromRequest(request),
    }
  }

export const blockHeightParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateBlockHeightParam(params.blockHeight!)
}

export const consensusTransactionParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateConsensusTxHashParam(params.hash!)
}

export const runtimeTransactionParamLoader = async ({ params }: LoaderFunctionArgs) => {
  return validateRuntimeTxHashParam(params.hash!)
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
    !RouteUtils.getAllLayersForNetwork(network as Network).enabled.includes(layer as Layer) // unsupported on network
  ) {
    throw new AppError(AppErrors.UnsupportedLayer)
  }
  return { network, layer } as SearchScope
}

export type ProposalIdLoaderData = {
  proposalId: number
  searchTerm: string
}

export const proposalIdParamLoader = async ({ params, request }: LoaderFunctionArgs) => {
  validateProposalIdParam(params.proposalId!)
  return {
    proposalId: parseInt(params.proposalId!),
    searchTerm: getSearchTermFromRequest(request),
  }
}

/**
 * Is it possible to change the scope, given the current configuration?
 */
export const isScopeSelectorNeeded = (sourceScope: SearchScope) => {
  switch (scopeFreedom) {
    case 'network':
      return RouteUtils.getEnabledNetworks().length > 1
    case 'layer':
      return RouteUtils.getVisibleLayersForNetwork(fixedNetwork!, sourceScope).length > 1
    case 'network-layer':
      return RouteUtils.getEnabledScopes().length > 1
    case 'none':
      return false
  }
}
