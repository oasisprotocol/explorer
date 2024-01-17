// eslint-disable-next-line no-restricted-imports
import { Layer } from './oasis-nexus/generated/api' // We get this from the generated code to avoid circular imports

export const consensusDecimals = 9

type LayerNetwork = {
  activeNodes: number | undefined
  address: string | undefined
  blockGasLimit: number | undefined
  runtimeId: string | undefined
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
    activeNodes: 60,
    address: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
    // Match max_batch_gas https://github.com/oasisprotocol/emerald-paratime/blob/5a36a646b989e510fadc0029178fe96a24cad101/src/lib.rs#L112-L112
    blockGasLimit: 10_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
  },
  testnet: {
    activeNodes: 28,
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
    activeNodes: 31,
    address: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    // See max_batch_gas https://github.com/oasisprotocol/sapphire-paratime/blob/5cbcdf764390bba3ae27411c551a4f4444117f3f/runtime/src/lib.rs#L146
    blockGasLimit: 15_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
  },
  testnet: {
    activeNodes: 16,
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    blockGasLimit: 30_000_000,
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

type LayersConfig = {
  [key in Layer]: LayerConfig | null
}

export const paraTimesConfig = {
  [Layer.cipher]: cipherConfig,
  [Layer.emerald]: emeraldConfig,
  [Layer.sapphire]: sapphireConfig,
  [Layer.consensus]: null,
} satisfies LayersConfig

export const deploys = {
  production: ['https://explorer.oasis.io', 'https://explorer.prd.oasis.io'],
  staging: 'https://explorer.stg.oasis.io',
  localhost: 'http://localhost:1234',
}

export const stableDeploys = [...deploys.production, deploys.staging]
