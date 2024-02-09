import { LoaderFunctionArgs } from 'react-router-dom'
import { isValidProposalId, isValidTxHash } from './helpers'
import { isValidBlockHeight, isValidOasisAddress, isValidEthAddress } from './helpers'
import { AppError, AppErrors } from '../../types/errors'
import { EvmTokenType, Layer } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { SearchScope } from '../../types/searchScope'
import { isStableDeploy } from '../../config'
import { getSearchTermFromRequest } from '../components/Search/search-utils'
import { isLayerNotHidden } from '../../types/layers'

export const isTesting = () => process.env.NODE_ENV === 'test'

export const getFixedNetwork = () =>
  isTesting() ? undefined : (process.env.REACT_APP_FIXED_NETWORK as Network | undefined)
export const getFixedLayer = () =>
  isTesting() ? undefined : (process.env.REACT_APP_FIXED_LAYER as Layer | undefined)
export const hasFixedNetwork = () => !!getFixedNetwork()

export const hasFixedLayer = () => !!getFixedLayer()

export type ScopeFreedom =
  | 'network' // We can select only the network
  | 'layer' // We can select only the layer
  | 'both' // We can select both network and layer
  | 'none' // We can't select anything, everything is fixed

export const getScopeFreedom = (): ScopeFreedom =>
  hasFixedNetwork() ? (hasFixedLayer() ? 'none' : 'layer') : hasFixedLayer() ? 'network' : 'both'

export const hasFixedNetworkAndLayer = () => !!getFixedNetwork() && !!getFixedLayer()

export const isFixedOnConsensus = () => getFixedLayer() === Layer.consensus

export const isFixedOnParatime = () => hasFixedLayer() && getFixedLayer() !== Layer.consensus

export type SpecifiedPerEnabledLayer<T = any, ExcludeLayers = never> = {
  [N in keyof (typeof RouteUtils)['ENABLED_LAYERS_FOR_NETWORK']]: {
    [L in keyof (typeof RouteUtils)['ENABLED_LAYERS_FOR_NETWORK'][N] as Exclude<
      L,
      ExcludeLayers
    >]: (typeof RouteUtils)['ENABLED_LAYERS_FOR_NETWORK'][N][L] extends true ? T : T | undefined
  }
}

export const networkRoutePath = hasFixedNetwork() ? '' : `/:_network`

export const layerRoutePath = hasFixedLayer() ? '' : `/:_layer`

export const consensusRoutePath = isFixedOnConsensus() ? '' : '/consensus'

export type SpecifiedPerEnabledRuntime<T = any> = SpecifiedPerEnabledLayer<T, typeof Layer.consensus>

const getNetworkPath = (network: Network) => (hasFixedNetwork() ? '' : `/${encodeURIComponent(network)}`)

const getLayerPath = (layer: Layer) => (hasFixedLayer() ? '' : `/${encodeURIComponent(layer)}`)

const getNetworkAndLayerPath = (network: Network, layer: Layer) =>
  `${getNetworkPath(network)}${getLayerPath(layer)}`

export abstract class RouteUtils {
  private static ENABLED_LAYERS_FOR_NETWORK = {
    [Network.mainnet]: {
      [Layer.emerald]: true,
      [Layer.sapphire]: true,
      [Layer.cipher]: false,
      [Layer.pontusx]: false,
      // Disable WIP Consensus on production an staging
      [Layer.consensus]: !isStableDeploy,
    },
    [Network.testnet]: {
      [Layer.emerald]: true,
      [Layer.sapphire]: true,
      [Layer.cipher]: false,
      [Layer.pontusx]: true,
      [Layer.consensus]: false,
    },
  } satisfies Record<Network, Record<Layer, boolean>>

  static getDashboardRoute = ({ network, layer }: SearchScope) => {
    return `${getNetworkAndLayerPath(network, layer)}`
  }

  static getLatestTransactionsRoute = ({ network, layer }: SearchScope) => {
    return `${getNetworkAndLayerPath(network, layer)}/tx`
  }

  static getTopTokensRoute = ({ network, layer }: SearchScope) => {
    return `${getNetworkAndLayerPath(network, layer)}/token`
  }

  static getLatestBlocksRoute = ({ network, layer }: SearchScope) => {
    return `${getNetworkAndLayerPath(network, layer)}/block`
  }

  static getBlockRoute = ({ network, layer }: SearchScope, blockHeight: number) => {
    return `${getNetworkAndLayerPath(network, layer)}/block/${encodeURIComponent(blockHeight)}`
  }

  static getTransactionRoute = (scope: SearchScope, txHash: string) => {
    return `${getNetworkAndLayerPath(scope.network, scope.layer)}/tx/${encodeURIComponent(txHash)}`
  }

  static getAccountRoute = ({ network, layer }: SearchScope, account: string) => {
    return `${getNetworkAndLayerPath(network, layer)}/address/${encodeURIComponent(account)}`
  }

  static getAccountsRoute = (network: Network) => {
    return `${getNetworkPath(network)}${consensusRoutePath}/address`
  }

  static getValidatorsRoute = (network: Network) => {
    return `${getNetworkPath(network)}${consensusRoutePath}/validators`
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
      ? `${getNetworkAndLayerPath(scope.network, scope.layer)}/search?q=${encodeURIComponent(searchTerm)}`
      : `/search?q=${encodeURIComponent(searchTerm)}`
  }

  static getTokenRoute = ({ network, layer }: SearchScope, tokenAddress: string) => {
    return `${getNetworkAndLayerPath(network, layer)}/token/${encodeURIComponent(tokenAddress)}`
  }

  static getTokenHoldersRoute = ({ network, layer }: SearchScope, tokenAddress: string) => {
    return `${getNetworkAndLayerPath(network, layer)}/token/${encodeURIComponent(tokenAddress)}/holders`
  }

  static getNFTInstanceRoute = (
    { network, layer }: SearchScope,
    contractAddress: string,
    instanceId: string,
  ): string =>
    `${getNetworkAndLayerPath(network, layer)}/token/${encodeURIComponent(
      contractAddress,
    )}/instance/${encodeURIComponent(instanceId)}`

  static getEnabledLayersForNetwork(network: Network): Layer[] {
    return Object.values(Layer).filter(layer => RouteUtils.ENABLED_LAYERS_FOR_NETWORK[network][layer])
  }

  static getVisibleLayersForNetwork(network: Network): Layer[] {
    return this.getEnabledLayersForNetwork(network).filter(isLayerNotHidden)
  }

  static getProposalsRoute = (network: Network) => {
    return `${getNetworkPath(network)}/consensus/proposal`
  }

  static getProposalRoute = (network: Network, proposalId: string | number) => {
    return `${getNetworkPath(network)}/consensus/proposal/${encodeURIComponent(proposalId)}`
  }

  static getEnabledScopes(): SearchScope[] {
    return RouteUtils.getEnabledNetworks().flatMap(network =>
      RouteUtils.getEnabledLayersForNetwork(network).map(layer => ({ network, layer })),
    )
  }

  static getEnabledNetworks(): Network[] {
    return hasFixedNetwork()
      ? [getFixedNetwork()!]
      : Object.values(Network).filter(network => {
          return RouteUtils.getEnabledLayersForNetwork(network).length > 0
        })
  }

  static getEnabledNetworksForLayer(layer: Layer): Network[] {
    return (hasFixedNetwork() ? [getFixedNetwork()!] : Object.values(Network)).filter(network => {
      return RouteUtils.getEnabledLayersForNetwork(network).includes(layer)
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
  searchTerm: string
}

const validateProposalIdParam = (proposalId: string) => {
  const isValid = isValidProposalId(proposalId)
  if (!isValid) {
    throw new AppError(AppErrors.InvalidProposalId)
  }

  return isValid
}

export const addressParamLoader =
  (queryParam: string = 'address') =>
  ({ params, request }: LoaderFunctionArgs): AddressLoaderData => {
    validateAddressParam(params[queryParam]!)
    return {
      address: params[queryParam]!,
      searchTerm: getSearchTermFromRequest(request),
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
