import { Network } from '../../types/network'
import { defaultTheme } from './defaultTheme'
import { testnetTheme } from './testnet/theme'
import type { Theme } from '@mui/material/styles/createTheme'
import { Layer } from '../../oasis-nexus/api'

export { defaultTheme } from './defaultTheme'
export { testnetTheme } from './testnet/theme'

export const tooltipDelay = 500
export const typingDelay = 1000

export const getThemeForScope = (network: Network, layer?: Layer): Theme => {
  switch (network) {
    case Network.mainnet:
      return defaultTheme
    case Network.testnet:
      return testnetTheme
  }
}
