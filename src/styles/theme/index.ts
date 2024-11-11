import { Network } from '../../types/network'
import { defaultTheme } from './defaultTheme'
import { testnetTheme } from './testnet/theme'
import { localnetTheme } from './localnet/theme'
import type { Theme } from '@mui/material/styles/createTheme'
import { Layer } from '../../oasis-nexus/api'
import { specialScopeThemes } from '../../config'

export { defaultTheme } from './defaultTheme'
export { testnetTheme } from './testnet/theme'
export { localnetTheme } from './localnet/theme'

export const tooltipDelay = 500
export const typingDelay = 1000

export const getThemeForScope = (network: Network, layer?: Layer): Theme => {
  const specialTheme = layer ? specialScopeThemes[network]?.[layer] : undefined
  if (specialTheme) return specialTheme

  switch (network) {
    case Network.mainnet:
      return defaultTheme
    case Network.testnet:
      return testnetTheme
    case Network.localnet:
      return localnetTheme
  }
}
