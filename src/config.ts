export const consensusDecimals = 9

type LayerNetwork = {
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
}

export enum RuntimeTypes {
  Evm = 'evm',
  Oasis = 'oasis',
}

const emeraldConfig: LayerConfig = {
  mainnet: {
    address: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
    blockGasLimit: 10_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
  },
  testnet: {
    address: 'oasis1qr629x0tg9gm5fyhedgs9lw5eh3d8ycdnsxf0run',
    blockGasLimit: 30_000_000,
    runtimeId: '00000000000000000000000000000000000000000000000072c8215e60d5bca7',
  },
  local: {
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
}

const cipherConfig: LayerConfig = {
  mainnet: {
    address: 'oasis1qrnu9yhwzap7rqh6tdcdcpz0zf86hwhycchkhvt8',
    blockGasLimit: undefined, // TODO: provide gas limit
    runtimeId: '000000000000000000000000000000000000000000000000e199119c992377cb',
  },
  testnet: {
    address: 'oasis1qqdn25n5a2jtet2s5amc7gmchsqqgs4j0qcg5k0t',
    blockGasLimit: undefined, // TODO: provide gas limit
    runtimeId: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  local: {
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },
  decimals: 9,
  type: RuntimeTypes.Oasis,
}

const sapphireConfig: LayerConfig = {
  mainnet: {
    address: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    blockGasLimit: 15_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
  },
  testnet: {
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    blockGasLimit: 30_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
  },
  local: {
    address: undefined,
    blockGasLimit: undefined,
    runtimeId: undefined,
  },

  decimals: 18,
  type: RuntimeTypes.Evm,
}

export enum Layer {
  Cipher = 'cipher',
  Emerald = 'emerald',
  Sapphire = 'sapphire',
  Consensus = 'consensus',
}

type LayersConfig = {
  [key in Layer]: LayerConfig | null
}

export const paraTimesConfig: LayersConfig = {
  [Layer.Cipher]: cipherConfig,
  [Layer.Emerald]: emeraldConfig,
  [Layer.Sapphire]: sapphireConfig,
  [Layer.Consensus]: null,
}

// TODO: refactor this when we have network specific builds and/or another paraTime is added
export const blockGasLimit = paraTimesConfig[Layer.Emerald]?.mainnet.blockGasLimit!
