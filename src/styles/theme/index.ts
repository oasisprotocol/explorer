import { GlobalNetwork, Network, NetworkOrGlobal } from '../../types/network'
import { defaultTheme } from './defaultTheme'
import { testnetTheme } from './testnet/theme'
import type { Theme } from '@mui/material/styles/createTheme'

export { defaultTheme } from './defaultTheme'
export { testnetTheme } from './testnet/theme'

export const tooltipDelay = 500

export const getThemesForNetworks: () => Record<NetworkOrGlobal, Theme> = () => ({
  [Network.mainnet]: defaultTheme,
  [Network.testnet]: testnetTheme,
  [GlobalNetwork]: defaultTheme,
})
