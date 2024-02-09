import { FC, ReactNode } from 'react'
import { Network } from '../../../types/network'
import { ThemeProvider } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import CssBaseline from '@mui/material/CssBaseline'
import { getFixedNetwork } from '../../utils/route-utils'

export const ThemeByNetwork: FC<{ network: Network; children: React.ReactNode }> = ({
  network,
  children,
}) => (
  <ThemeProvider theme={getThemesForNetworks()[network]}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

export const withMainnetTheme = (node: ReactNode) => (
  <ThemeByNetwork network={Network.mainnet}>{node}</ThemeByNetwork>
)

export const withDefaultTheme = (node: ReactNode) => (
  <ThemeByNetwork network={getFixedNetwork() ?? Network.mainnet}>{node}</ThemeByNetwork>
)
