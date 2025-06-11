import { Ticker } from 'types/ticker'
import { Network } from '../../types/network'
import { Layer } from '../../oasis-nexus/api'
import { faucets } from './externalLinks'

const faucetLinks: Partial<Record<Network, Partial<Record<Layer, Partial<Record<Ticker, string>>>>>> = {
  testnet: {
    consensus: { [Ticker.TEST]: faucets.oasisTestnet },
    emerald: { [Ticker.TEST]: `${faucets.oasisTestnet}?paratime=emerald` },
    sapphire: { [Ticker.TEST]: `${faucets.oasisTestnet}?paratime=sapphire` },
    cipher: { [Ticker.TEST]: `${faucets.oasisTestnet}?paratime=cipher` },
    pontusxdev: {
      [Ticker.EUROe]: `mailto:contact@delta-dao.com?subject=${encodeURIComponent('Request test tokens for Pontus-X Devnet')}`,
    },
    pontusxtest: {
      [Ticker.EUROe]: `mailto:contact@delta-dao.com?subject=${encodeURIComponent('Request test tokens for Pontus-X Testnet')}`,
    },
  },
}

export const getFaucetLink = (network: Network, layer: Layer, ticker: Ticker) =>
  faucetLinks[network]?.[layer]?.[ticker]
