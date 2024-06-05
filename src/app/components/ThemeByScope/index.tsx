import { FC, ReactNode } from 'react'
import { Network } from '../../../types/network'
import { ThemeProvider } from '@mui/material/styles'
import { getThemeForScope } from '../../../styles/theme'
import CssBaseline from '@mui/material/CssBaseline'
import { fixedNetwork } from '../../utils/route-utils'

export const ThemeByScope: FC<{ network: Network; isRootTheme: boolean; children: React.ReactNode }> = ({
  network,
  isRootTheme,
  children,
}) => (
  <ThemeProvider theme={getThemeForScope(network)}>
    {isRootTheme && <CssBaseline />}
    {children}
  </ThemeProvider>
)

export const withDefaultTheme = (node: ReactNode, alwaysMainnet = false) => (
  <ThemeByScope
    isRootTheme={true}
    network={alwaysMainnet ? Network.mainnet : fixedNetwork ?? Network.mainnet}
  >
    {node}
  </ThemeByScope>
)
