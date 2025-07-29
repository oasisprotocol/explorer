import { Ticker } from 'types/ticker'
import { Network } from '../../types/network'
import { Layer } from '../../oasis-nexus/api'
import { faucets } from './externalLinks'
import { TFunction } from 'i18next'

type FaucetInfo = {
  url: string
  description: string
  title: string
  label: string
}

export const getFaucetInfo = (
  t: TFunction,
  network: Network,
  layer: Layer,
  ticker: Ticker,
): FaucetInfo | undefined => {
  const faucetLinks: Partial<Record<Network, Partial<Record<Layer, Partial<Record<Ticker, FaucetInfo>>>>>> = {
    testnet: {
      consensus: {
        [Ticker.TEST]: {
          url: faucets.oasisTestnet,
          description: t('testnetFaucet.description'),
          title: t('testnetFaucet.header'),
          label: t('testnetFaucet.request'),
        },
      },
      emerald: {
        [Ticker.TEST]: {
          url: `${faucets.oasisTestnet}?paratime=emerald`,
          description: t('testnetFaucet.description'),
          title: t('testnetFaucet.header'),
          label: t('testnetFaucet.request'),
        },
      },
      sapphire: {
        [Ticker.TEST]: {
          url: `${faucets.oasisTestnet}?paratime=sapphire`,
          description: t('testnetFaucet.description'),
          title: t('testnetFaucet.header'),
          label: t('testnetFaucet.request'),
        },
      },
      cipher: {
        [Ticker.TEST]: {
          url: `${faucets.oasisTestnet}?paratime=cipher`,
          description: t('testnetFaucet.description'),
          title: t('testnetFaucet.header'),
          label: t('testnetFaucet.request'),
        },
      },
      pontusxdev: {
        [Ticker.EUROe]: {
          url: `mailto:contact@delta-dao.com?subject=${encodeURIComponent('Request test tokens for Pontus-X Devnet')}`,
          description: t('testnetFaucet.description'),
          title: t('testnetFaucet.header'),
          label: t('testnetFaucet.request'),
        },
      },
      pontusxtest: {
        [Ticker.EUROe]: {
          url: `mailto:contact@delta-dao.com?subject=${encodeURIComponent('Request test tokens for Pontus-X Testnet')}`,
          description: t('testnetFaucet.description'),
          title: t('testnetFaucet.header'),
          label: t('testnetFaucet.request'),
        },
      },
    },
  }
  return faucetLinks[network]?.[layer]?.[ticker]
}
