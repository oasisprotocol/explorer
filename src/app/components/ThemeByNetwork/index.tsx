import { FC, ReactNode } from 'react'
import { Network } from '../../../types/network'
import { ThemeProvider } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import CssBaseline from '@mui/material/CssBaseline'
import { fixedNetwork } from '../../utils/route-utils'

export const ThemeByNetwork: FC<{ network: Network; isRootTheme: boolean; children: React.ReactNode }> = ({
  network,
  isRootTheme,
  children,
}) => (
  <ThemeProvider theme={getThemesForNetworks()[network]}>
    {isRootTheme && <CssBaseline />}
    {children}
  </ThemeProvider>
)

export const withDefaultTheme = (node: ReactNode, alwaysMainnet = false) => (
  <ThemeByNetwork
    isRootTheme={true}
    network={alwaysMainnet ? Network.mainnet : fixedNetwork ?? Network.mainnet}
  >
    {node}
  </ThemeByNetwork>
)
