import { FC, ReactNode } from 'react'
import { Network } from '../../../types/network'
import { ThemeProvider } from '@mui/material/styles'
import { getThemeForScope } from '../../../styles/theme'
import { fixedNetwork } from '../../utils/route-utils'
import { Layer } from '../../../oasis-nexus/api'

export const ThemeByScope: FC<{
  network: Network
  layer?: Layer
  children: React.ReactNode
}> = ({ network, layer, children }) => (
  <ThemeProvider theme={getThemeForScope(network, layer)}>
    <div className={network}>{children}</div>
  </ThemeProvider>
)

export const withDefaultTheme = (node: ReactNode, alwaysMainnet = false) => (
  <ThemeByScope network={alwaysMainnet ? 'mainnet' : (fixedNetwork ?? 'mainnet')}>{node}</ThemeByScope>
)
