// We get this from the generated code to avoid circular imports
// eslint-disable-next-line no-restricted-imports
import { Layer } from './oasis-nexus/generated/api'
import { getTokenForNetwork, NativeToken, NativeTokenInfo } from './types/ticker'
import { SearchScope } from './types/searchScope'

export const consensusDecimals = 9

type LayerNetwork = {
  activeNodes: number | undefined
  address: string | undefined
  blockGasLimit: number | undefined
  runtimeId: string | undefined

  /**
   * What are the native tokens on this layer?
   *
   * (If not given, the network's default token will be used.)
   */
  tokens?: NativeTokenInfo[]

  /**
   * What fiat currency should we use for displaying value?
   */
  fiatCurrency?: string
}

type LayerConfig = {
  mainnet: LayerNetwork
  testnet: LayerNetwork
  local: LayerNetwork
  decimals: number
  type: RuntimeTypes

  /**
   * The maximum processing delay above which we consider the data on this paratime to be out of date.
   *
   * Specified in milliseconds.
   */
  outOfDateThreshold: number
}

export enum RuntimeTypes {
  Evm = 'evm',
  Oasis = 'oasis',
}

// consensusConfig: max_block_size = 22020096, max_block_gas = unlimited right now

const emeraldConfig: LayerConfig = {
  mainnet: {
    activeNodes: 65,
    address: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
    // Match max_batch_gas https://github.com/oasisprotocol/emerald-paratime/blob/5a36a646b989e510fadc0029178fe96a24cad101/src/lib.rs#L112-L112
    blockGasLimit: 10_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
  },
  testnet: {
    activeNodes: 32,
    address: 'oasis1qr629x0tg9gm5fyhedgs9lw5eh3d8ycdnsxf0run',
    blockGasLimit: 30_000_000,
    runtimeId: '00000000000000000000000000000000000000000000000072c8215e60d5bca7',
  },
  local: {
    activeNodes: undefined,
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
  outOfDateThreshold: 2 * 60 * 1000,
}

const cipherConfig: LayerConfig = {
  mainnet: {
    activeNodes: 34,
    address: 'oasis1qrnu9yhwzap7rqh6tdcdcpz0zf86hwhycchkhvt8',
    blockGasLimit: undefined, // TODO: provide gas limit
    runtimeId: '000000000000000000000000000000000000000000000000e199119c992377cb',
  },
  testnet: {
    activeNodes: 15,
    address: 'oasis1qqdn25n5a2jtet2s5amc7gmchsqqgs4j0qcg5k0t',
    blockGasLimit: undefined, // TODO: provide gas limit
    runtimeId: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  local: {
    activeNodes: undefined,
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },
  decimals: 9,
  type: RuntimeTypes.Oasis,
  outOfDateThreshold: 2 * 60 * 1000,
}

const sapphireConfig: LayerConfig = {
  mainnet: {
    activeNodes: 41,
    address: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    // See max_batch_gas https://github.com/oasisprotocol/sapphire-paratime/blob/main/runtime/src/lib.rs#L166
    blockGasLimit: 15_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
  },
  testnet: {
    activeNodes: 21,
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    // See max_batch_gas https://github.com/oasisprotocol/sapphire-paratime/blob/main/runtime/src/lib.rs#L166
    blockGasLimit: 15_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
  },
  local: {
    activeNodes: undefined,
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },

  decimals: 18,
  type: RuntimeTypes.Evm,
  outOfDateThreshold: 2 * 60 * 1000,
}

const pontusxConfig: LayerConfig = {
  mainnet: {
    activeNodes: undefined,
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },
  testnet: {
    activeNodes: 8, // TODO use correct number
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd', // TODO use correct address
    // See max_batch_gas https://github.com/oasisprotocol/sapphire-paratime/blob/main/runtime/src/lib.rs#L166
    blockGasLimit: 15_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
    tokens: [NativeToken.EUROe, NativeToken.TEST],
    fiatCurrency: 'eur',
  },
  local: {
    activeNodes: undefined,
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },

  decimals: 18,
  type: RuntimeTypes.Evm,
  outOfDateThreshold: 2 * 60 * 1000,
}

type LayersConfig = {
  [key in Layer]: LayerConfig | null
}

export const paraTimesConfig = {
  [Layer.cipher]: cipherConfig,
  [Layer.emerald]: emeraldConfig,
  [Layer.sapphire]: sapphireConfig,
  [Layer.pontusx]: pontusxConfig,
  [Layer.consensus]: null,
} satisfies LayersConfig

const splitUrls = (input: string | undefined): string[] =>
  input
    ? input
        .split(',')
        .filter(s => !!s)
        .map(s => s.trim())
    : []

export const deploys = {
  production: splitUrls(process.env.REACT_APP_PRODUCTION_URLS),
  staging: splitUrls(process.env.REACT_APP_STAGING_URLS),
  localhost: 'http://localhost:1234',
}

const stableDeploys = [...deploys.production, deploys.staging]
export const isStableDeploy = stableDeploys.some(url => window.location.origin === url)

export const getAppTitle = () => process.env.REACT_APP_META_TITLE

export const getTokensForScope = (scope: SearchScope | undefined): NativeTokenInfo[] => {
  if (!scope) {
    return []
  }
  const { network, layer } = scope
  const networkDefault = getTokenForNetwork(network)

  if (layer !== Layer.consensus) {
    return paraTimesConfig[layer][network].tokens ?? [networkDefault]
  }
  return [networkDefault]
}

export const getFiatCurrencyForScope = (scope: SearchScope | undefined) =>
  (scope ? paraTimesConfig[scope.layer]?.[scope.network]?.fiatCurrency : undefined) ?? 'usd'
