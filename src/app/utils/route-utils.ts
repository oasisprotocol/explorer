import { LoaderFunctionArgs } from 'react-router-dom'
import { isValidProposalId, isValidRoflAppId, isValidTxHash, isValidTxOasisHash } from './helpers'
import { isValidBlockHeight, isValidOasisAddress, isValidEthAddress } from './helpers'
import { AppError, AppErrors } from '../../types/errors'
import { EvmTokenType, HasScope, Layer } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { SearchScope } from '../../types/searchScope'
import { specialScopePaths } from '../../config'
import { getSearchTermFromRequest } from '../components/Search/search-utils'
import { toChecksumAddress } from '@ethereumjs/util'
import { orderByLayer } from '../../types/layers'

export const fixedNetwork = process.env.REACT_APP_FIXED_NETWORK as Network | undefined
export const fixedLayer = process.env.REACT_APP_FIXED_LAYER as Layer | undefined
export const skipGraph = !!fixedLayer || !!(process.env.REACT_APP_SKIP_GRAPH as boolean | undefined)

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

export const specialScopeRecognition: Partial<Record<string, Partial<Record<string, SearchScope>>>> = {}

function invertSpecialScopePaths() {
  const networks = Object.keys(specialScopePaths) as Network[]

  networks.forEach(network => {
    const networkPaths = specialScopePaths[network]!
    const layers = Object.keys(networkPaths) as Layer[]
    layers.forEach(layer => {
      const [word1, word2] = networkPaths[layer]!
      if (!specialScopeRecognition[word1]) {
        specialScopeRecognition[word1] = {}
      }
      if (specialScopeRecognition[word1]![word2]) {
        const other = specialScopeRecognition[word1]![word2]!
        console.warn(
          `Wrong config: conflicting special scope paths ${word1}/${word2} definitions used both for ${other.network}/${other.layer} and ${network}/${layer} `,
        )
      } else {
        specialScopeRecognition[word1]![word2] = { network, layer }
      }
    })
  })
}

invertSpecialScopePaths()

export const hiddenScopes: SearchScope[] = [
  { network: Network.testnet, layer: Layer.pontusxdev },
  { network: Network.mainnet, layer: Layer.pontusxdev },
  { network: Network.mainnet, layer: Layer.pontusxtest },
  // { network: Network.mainnet, layer: Layer.sapphire }, // This is only for testing
]

export const mergeNetworksInLayerSelector = false

export const isScopeHidden = (scope: SearchScope): boolean =>
  !!hiddenScopes.find(s => s.network === scope.network && s.layer === scope.layer)

export const isNotInHiddenScope = (item: HasScope) => !isScopeHidden(item)

const formatPreservedParams = (searchParams: URLSearchParams | undefined, paramsToKeep: string[]): string => {
  if (!searchParams) return ''
  const toDelete: string[] = []
  searchParams.forEach((_, key) => {
    if (!paramsToKeep.includes(key)) toDelete.push(key)
  })
  toDelete.forEach(key => searchParams.delete(key))
  const formatted = searchParams.toString()
  return formatted.length ? `?${formatted}` : ''
}

export abstract class RouteUtils {
  private static ENABLED_LAYERS_FOR_NETWORK = {
    [Network.mainnet]: {
      [Layer.emerald]: true,
      [Layer.sapphire]: true,
      [Layer.cipher]: false,
      [Layer.pontusxdev]: false,
      [Layer.pontusxtest]: false,
      [Layer.consensus]: true,
    },
    [Network.testnet]: {
      [Layer.emerald]: true,
      [Layer.sapphire]: true,
      [Layer.cipher]: false,
      [Layer.pontusxdev]: true,
      [Layer.pontusxtest]: true,
      [Layer.consensus]: true,
    },
    [Network.localnet]: {
      [Layer.emerald]: process.env.REACT_APP_LOCALNET_EMERALD === 'true',
      [Layer.sapphire]: process.env.REACT_APP_LOCALNET_SAPPHIRE === 'true',
      [Layer.cipher]: false,
      [Layer.pontusxdev]: false,
      [Layer.pontusxtest]: false,
      [Layer.consensus]: process.env.REACT_APP_LOCALNET_CONSENSUS === 'true',
    },
  } satisfies Record<Network, Record<Layer, boolean>>

  static getScopeRoute = ({ network, layer }: SearchScope) => {
    const specialPath = specialScopePaths[network]?.[layer]
    const result = specialPath
      ? `/${specialPath[0]}/${specialPath[1]}`
      : `/${encodeURIComponent(network)}/${encodeURIComponent(layer)}`
    return result
  }

  static getDashboardRoute = (scope: SearchScope) => this.getScopeRoute(scope)

  static getLatestTransactionsRoute = (scope: SearchScope) => {
    return `${this.getScopeRoute(scope)}/tx`
  }

  static getTopTokensRoute = (scope: SearchScope) => {
    return `${this.getScopeRoute(scope)}/token`
  }

  static getLatestBlocksRoute = (scope: SearchScope) => {
    return `${this.getScopeRoute(scope)}/block`
  }

  static getBlockRoute = (
    scope: SearchScope,
    blockHeight: number,
    searchParams?: URLSearchParams,
    preserveParams: string[] = [],
  ) => {
    return `${this.getScopeRoute(scope)}/block/${encodeURIComponent(blockHeight)}${formatPreservedParams(searchParams, preserveParams)}`
  }

  static getTransactionRoute = (scope: SearchScope, txHash: string) => {
    return `${this.getScopeRoute(scope)}/tx/${encodeURIComponent(txHash)}`
  }

  static getAccountRoute = (scope: SearchScope, accountAddress: string) => {
    return `${this.getScopeRoute(scope)}/address/${encodeURIComponent(accountAddress)}`
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

  static getRoflAppsRoute = (network: Network) => {
    return `/${encodeURIComponent(network)}/sapphire/rofl/app`
  }

  static getRoflAppRoute = (network: Network, id: string) => {
    return `/${encodeURIComponent(network)}/sapphire/rofl/app/${encodeURIComponent(id)}`
  }

  static getRoflAppInstanceRoute = (network: Network, id: string, rak: string) => {
    return `/${encodeURIComponent(network)}/sapphire/rofl/app/${encodeURIComponent(id)}/instance/${encodeURIComponent(rak)}`
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
      ? `${this.getScopeRoute(scope)}/search?q=${encodeURIComponent(searchTerm)}`
      : `/search?q=${encodeURIComponent(searchTerm)}`
  }

  static getTokenRoute = (scope: SearchScope, tokenAddress: string) => {
    return `${this.getScopeRoute(scope)}/token/${encodeURIComponent(tokenAddress)}`
  }

  static getTokenHoldersRoute = (scope: SearchScope, tokenAddress: string) => {
    return `${this.getScopeRoute(scope)}/token/${encodeURIComponent(tokenAddress)}/holders`
  }

  static getNFTInstanceRoute = (scope: SearchScope, contractAddress: string, instanceId: string): string =>
    `${this.getScopeRoute(scope)}/token/${encodeURIComponent(
      contractAddress,
    )}/instance/${encodeURIComponent(instanceId)}`

  static getAllLayersForNetwork(network: Network): { enabled: Layer[]; disabled: Layer[] } {
    const enabled: Layer[] = []
    const disabled: Layer[] = []
    Object.values(Layer)
      .sort(orderByLayer)
      .forEach(layer => {
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
      layer => !isScopeHidden({ network, layer }) || layer === currentScope?.layer,
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
      scope => !isScopeHidden(scope) || scope.layer === currentScope?.layer,
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

const validateRoflAppIdParam = (id: string) => {
  const isValid = isValidRoflAppId(id)

  if (!isValid) {
    throw new AppError(AppErrors.InvalidRoflAppId)
  }

  return isValid
}

export type RoflAppLoaderData = {
  id: string
  searchTerm: string
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
    const rawAddress = params[queryParam]!
    validateRuntimeAddressParam(rawAddress)
    return {
      address: isValidEthAddress(rawAddress) ? toChecksumAddress(rawAddress) : rawAddress,
      searchTerm: getSearchTermFromRequest(request),
    }
  }

export const roflAppParamLoader =
  (queryParam: string = 'id') =>
  ({ params, request }: LoaderFunctionArgs): RoflAppLoaderData => {
    validateRoflAppIdParam(params[queryParam]!)
    return {
      id: params[queryParam]!,
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

export const assertEnabledScope = (params: {
  network: string | undefined
  layer: string | undefined
}): SearchScope => {
  const { network: networkLike, layer: layerLike } = params
  if (!networkLike || !layerLike) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  const { network, layer } = specialScopeRecognition[networkLike]?.[layerLike] ?? {
    network: networkLike as Network,
    layer: layerLike as Layer,
  }

  if (!RouteUtils.getEnabledNetworks().includes(network as Network)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  if (
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

export const isLocalnet = (network: Network) => network === 'localnet'
