export const consensusDecimals = 9

type ParaTimeNetwork = {
  address: string | undefined
  gasLimit: number | undefined
  runtimeId: string | undefined
}

type ParaTimeConfig = {
  mainnet: ParaTimeNetwork
  testnet: ParaTimeNetwork
  local: ParaTimeNetwork
  decimals: number
  type: RuntimeTypes
}

export enum RuntimeTypes {
  Evm = 'evm',
  Oasis = 'oasis',
}

const emeraldConfig: ParaTimeConfig = {
  mainnet: {
    address: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
    gasLimit: 10_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
  },
  testnet: {
    address: 'oasis1qr629x0tg9gm5fyhedgs9lw5eh3d8ycdnsxf0run',
    gasLimit: 30_000_000,
    runtimeId: '00000000000000000000000000000000000000000000000072c8215e60d5bca7',
  },
  local: {
    address: undefined,
    gasLimit: undefined,
    runtimeId: undefined,
  },
  decimals: 18,
  type: RuntimeTypes.Evm,
}

const cipherConfig: ParaTimeConfig = {
  mainnet: {
    address: 'oasis1qrnu9yhwzap7rqh6tdcdcpz0zf86hwhycchkhvt8',
    gasLimit: undefined, // TODO: provide gas limit
    runtimeId: '000000000000000000000000000000000000000000000000e199119c992377cb',
  },
  testnet: {
    address: 'oasis1qqdn25n5a2jtet2s5amc7gmchsqqgs4j0qcg5k0t',
    gasLimit: undefined, // TODO: provide gas limit
    runtimeId: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  local: {
    address: undefined,
    gasLimit: undefined,
    runtimeId: undefined,
  },
  decimals: 9,
  type: RuntimeTypes.Oasis,
}

const sapphireConfig: ParaTimeConfig = {
  mainnet: {
    address: undefined,
    gasLimit: 15_000_000,
    runtimeId: undefined,
  },
  testnet: {
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    gasLimit: 30_000_000,
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
  },
  local: {
    address: undefined,
    gasLimit: undefined,
    runtimeId: undefined,
  },

  decimals: 18,
  type: RuntimeTypes.Evm,
}

export enum ParaTime {
  Cipher = 'cipher',
  Emerald = 'emerald',
  Sapphire = 'sapphire',
}

type ParaTimesConfig = {
  [key in ParaTime]: ParaTimeConfig
}

export const paraTimesConfig: ParaTimesConfig = {
  [ParaTime.Cipher]: cipherConfig,
  [ParaTime.Emerald]: emeraldConfig,
  [ParaTime.Sapphire]: sapphireConfig,
}
