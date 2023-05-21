import React, { FC } from 'react'
import { Network } from '../../../types/network'
import { ThemeProvider } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'

export const NetworkThemeBubble: FC<{ network: Network; children: React.ReactNode }> = ({
  network,
  children,
}) => <ThemeProvider theme={getThemesForNetworks()[network]}>{children}</ThemeProvider>
