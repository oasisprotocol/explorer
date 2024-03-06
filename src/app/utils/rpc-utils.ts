import { JsonRpcProvider, formatUnits } from 'ethers'
import { Network } from '../../types/network'
import { consensusDecimals, paraTimesConfig } from '../../config'
// oasis-nexus/api introduces circular dependency
// eslint-disable-next-line no-restricted-imports
import { Layer } from '../../oasis-nexus/generated/api'

const RPC_ENDPOINTS: Record<Network, Partial<Record<Layer, string>>> = {
  [Network.mainnet]: {
    [Layer.emerald]: 'https://emerald.oasis.dev',
    [Layer.sapphire]: 'https://sapphire.oasis.io',
  },
  [Network.testnet]: {
    [Layer.emerald]: 'https://testnet.emerald.oasis.dev',
    [Layer.sapphire]: 'https://testnet.sapphire.oasis.dev',
    [Layer.pontusx]: 'https://grpc.sapphire.testnet.oasiscloud.io:443',
  },
}

const LAYER_DECIMALS: Record<Layer, number> = {
  [Layer.emerald]: paraTimesConfig[Layer.emerald].decimals,
  [Layer.sapphire]: paraTimesConfig[Layer.sapphire].decimals,
  [Layer.cipher]: paraTimesConfig[Layer.cipher].decimals,
  [Layer.pontusx]: paraTimesConfig[Layer.pontusx].decimals,
  [Layer.consensus]: consensusDecimals,
}

interface RpcProviderOptions {
  context: {
    network: Network
    layer: Layer
  }
}

export abstract class RpcUtils {
  private static _provider: JsonRpcProvider | null = null
  private static _providerLayer: Layer | null = null
  private static _providerNetwork: Network | null = null

  private static _getProvider(opts: RpcProviderOptions): JsonRpcProvider | null {
    const {
      context: { network, layer },
    } = opts
    const rpcEndpoint = RPC_ENDPOINTS[network]?.[layer]

    if (!rpcEndpoint) {
      // Silently fail, due to this being used in search
      return null
    }

    if (RpcUtils._providerNetwork === network && RpcUtils._providerLayer === layer && RpcUtils._provider) {
      return RpcUtils._provider
    }

    RpcUtils._provider = new JsonRpcProvider(rpcEndpoint)
    RpcUtils._providerNetwork = network
    RpcUtils._providerLayer = layer

    return RpcUtils._provider
  }

  static async getAccountBalance(address: string, opts: RpcProviderOptions): Promise<string | null> {
    const provider = RpcUtils._getProvider(opts)

    if (!provider) {
      return null
    }

    const balance = await provider.getBalance(address)

    const {
      context: { layer },
    } = opts
    const decimals = LAYER_DECIMALS[layer]
    return formatUnits(balance.toString(), decimals)
  }
}
