// We get this from the generated code to avoid circular imports
// eslint-disable-next-line no-restricted-imports
import { Layer } from './oasis-nexus/generated/api'
import { NativeToken, NativeTokenInfo } from './types/ticker'
import { SearchScope } from './types/searchScope'
import { Network } from './types/network'
import type { Theme } from '@mui/material/styles/createTheme'

export const NUMBER_OF_ITEMS_ON_DASHBOARD = 5
export const FILTERING_ON_DASHBOARD = true
export const NUMBER_OF_ITEMS_ON_SEPARATE_PAGE = 10
export const REFETCH_INTERVAL = 5000
export const API_MAX_TOTAL_COUNT = 1000

export const consensusDecimals = 9
/**
 * The maximum processing delay above which we consider the data on this paratime to be out of date.
 *
 * Specified in milliseconds.
 */
export const outOfDateThreshold = 2 * 60 * 1000

type LayerNetwork = {
  address: string | undefined
  blockGasLimit: number | undefined
  runtimeId: string | undefined

  /**
   * What are the tokens on this layer?
   * Note: native token must be the first on the list. Others are just incorrectly named "Native"
   * See terminology in https://github.com/oasisprotocol/oasis-sdk/blob/5bec25f/client-sdk/go/config/default.go#L109-L120
   */
  tokens: [NativeTokenInfo, ...NativeTokenInfo[]]

  /**
   * What fiat currency should we use for displaying value?
   */
  fiatCurrency?: string
}

type LayerConfig = {
  mainnet: LayerNetwork
  testnet: LayerNetwork
  localnet?: LayerNetwork
  decimals: number
  type: RuntimeTypes
  offerRoflTxTypes?: boolean
}

export enum RuntimeTypes {
  Evm = 'evm',
  Oasis = 'oasis',
}

// consensusConfig: max_block_size = 22020096, max_block_gas = unlimited right now
export const consensusConfig = {
  mainnet: {
    tokens: [NativeToken.ROSE],
  },
  testnet: {
    tokens: [NativeToken.TEST],
  },
  localnet: {
    tokens: [NativeToken.TEST],
  },
  decimals: consensusDecimals,
}

const emeraldConfig: LayerConfig = {
  mainnet: {
    address: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
    // Match max_batch_gas https://github.com/oasisprotocol/emerald-paratime/blob/5a36a646b989e510fadc0029178fe96a24cad101/src/lib.rs#L112-L112
    blockGasLimit: 10_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
    tokens: [NativeToken.ROSE],
  },
  testnet: {
    address: 'oasis1qr629x0tg9gm5fyhedgs9lw5eh3d8ycdnsxf0run',
    blockGasLimit: 30_000_000,
    runtimeId: '00000000000000000000000000000000000000000000000072c8215e60d5bca7',
    tokens: [NativeToken.TEST],
  },
  localnet: {
    address: '',
    blockGasLimit: 30_000_000,
    runtimeId: '',
    tokens: [NativeToken.TEST],
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
}

const cipherConfig: LayerConfig = {
  mainnet: {
    address: 'oasis1qrnu9yhwzap7rqh6tdcdcpz0zf86hwhycchkhvt8',
    blockGasLimit: undefined, // TODO: provide gas limit
    runtimeId: '000000000000000000000000000000000000000000000000e199119c992377cb',
    tokens: [NativeToken.ROSE],
  },
  testnet: {
    address: 'oasis1qqdn25n5a2jtet2s5amc7gmchsqqgs4j0qcg5k0t',
    blockGasLimit: undefined, // TODO: provide gas limit
    runtimeId: '0000000000000000000000000000000000000000000000000000000000000000',
    tokens: [NativeToken.TEST],
  },
  decimals: 9,
  type: RuntimeTypes.Oasis,
}

const sapphireConfig: LayerConfig = {
  mainnet: {
    address: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    // See max_batch_gas https://github.com/oasisprotocol/sapphire-paratime/blob/main/runtime/src/lib.rs#L166
    blockGasLimit: 15_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
    tokens: [NativeToken.ROSE],
  },
  testnet: {
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    // See max_batch_gas https://github.com/oasisprotocol/sapphire-paratime/blob/main/runtime/src/lib.rs#L166
    blockGasLimit: 15_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
    tokens: [NativeToken.TEST],
  },
  localnet: {
    address: '',
    blockGasLimit: 15_000_000,
    runtimeId: '',
    tokens: [NativeToken.TEST],
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
  offerRoflTxTypes: true,
}

const pontusxDevConfig: LayerConfig = {
  mainnet: {
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
    tokens: [NativeToken.EUROe],
  },
  testnet: {
    address: 'oasis1qr02702pr8ecjuff2z3es254pw9xl6z2yg9qcc6c',
    blockGasLimit: 15_000_000,
    runtimeId: '0000000000000000000000000000000000000000000000004febe52eb412b421',
    tokens: [NativeToken.EUROe, NativeToken.TEST],
    fiatCurrency: 'eur',
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
}

const pontusxTestConfig: LayerConfig = {
  mainnet: {
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
    tokens: [NativeToken.EUROe],
  },
  testnet: {
    address: 'oasis1qrg6c89655pmdxeel08qkngs02jnrfll5v9c508v',
    blockGasLimit: 15_000_000,
    runtimeId: '00000000000000000000000000000000000000000000000004a6f9071c007069',
    tokens: [NativeToken.EUROe, NativeToken.TEST],
    fiatCurrency: 'eur',
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
}

type LayersConfig = {
  [key in Layer]: LayerConfig | null
}

export const paraTimesConfig = {
  [Layer.cipher]: cipherConfig,
  [Layer.emerald]: emeraldConfig,
  [Layer.sapphire]: sapphireConfig,
  [Layer.pontusxdev]: pontusxDevConfig,
  [Layer.pontusxtest]: pontusxTestConfig,
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

export const getAppTitle = () => process.env.REACT_APP_META_TITLE

export const getTokensForScope = (scope: SearchScope | undefined): NativeTokenInfo[] => {
  if (!scope) return []
  if (scope.layer === Layer.consensus) return consensusConfig[scope.network].tokens
  return paraTimesConfig?.[scope.layer]?.[scope.network]?.tokens!
}

export const getFiatCurrencyForScope = (scope: SearchScope | undefined) =>
  (scope ? paraTimesConfig[scope.layer]?.[scope.network]?.fiatCurrency : undefined) ?? 'usd'

export const showFiatValues = process.env.REACT_APP_SHOW_FIAT_VALUES === 'true'

export const specialScopeNames: Partial<Record<Network, Partial<Record<Layer, string>>>> = {
  [Network.mainnet]: {},
  [Network.testnet]: {},
}

export const specialScopePaths: Partial<Record<Network, Partial<Record<Layer, [string, string]>>>> = {
  [Network.mainnet]: {},
  [Network.testnet]: {},
}

export const specialScopeThemes: Partial<Record<Network, Partial<Record<Layer, Theme>>>> = {
  [Network.mainnet]: {},
  [Network.testnet]: {},
}
