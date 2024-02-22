import { Ticker } from 'types/ticker'
import { Network } from '../../types/network'
import { Layer } from '../../oasis-nexus/api'

const testnetFaucetUrl = 'https://faucet.testnet.oasis.dev/'
const faucetLinks: Partial<Record<Network, Partial<Record<Layer, Partial<Record<Ticker, string>>>>>> = {
  [Network.testnet]: {
    [Layer.consensus]: { [Ticker.TEST]: testnetFaucetUrl },
    [Layer.emerald]: { [Ticker.TEST]: `${testnetFaucetUrl}?paratime=emerald` },
    [Layer.sapphire]: { [Ticker.TEST]: `${testnetFaucetUrl}?paratime=sapphire` },
    [Layer.cipher]: { [Ticker.TEST]: `${testnetFaucetUrl}?paratime=cipher` },
    [Layer.pontusx]: {
      [Ticker.EUROe]: `mailto:contact@delta-dao.com?subject=${encodeURIComponent('Request test tokens')}`,
    },
  },
}

export const getFaucetLink = (network: Network, layer: Layer, ticker: Ticker) =>
  faucetLinks[network]?.[layer]?.[ticker]
