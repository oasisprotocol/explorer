import { Ticker } from 'types/ticker'
import { Network } from '../../types/network'
import { Layer } from '../../oasis-nexus/api'

const testnetFaucetUrl = 'https://faucet.testnet.oasis.dev/'
const faucetParaTimeBaseUrl = `${testnetFaucetUrl}?paratime=`
const faucetLinks: Partial<Record<Network, Partial<Record<Layer, Partial<Record<Ticker, string>>>>>> = {
  [Network.testnet]: {
    [Layer.consensus]: { [Ticker.TEST]: testnetFaucetUrl },
    [Layer.emerald]: { [Ticker.TEST]: `${faucetParaTimeBaseUrl}emerald` },
    [Layer.sapphire]: { [Ticker.TEST]: `${faucetParaTimeBaseUrl}sapphire` },
    [Layer.pontusx]: { [Ticker.TEST]: 'mailto:contact@delta-dao.com?subject=tokens' },
    [Layer.cipher]: { [Ticker.TEST]: `${faucetParaTimeBaseUrl}cipher` },
  },
}

export const getFaucetLink = (network: Network, layer: Layer, ticker: Ticker) =>
  faucetLinks[network]?.[layer]?.[ticker]
