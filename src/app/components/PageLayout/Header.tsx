import { FC } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { Search } from '../Search'
import { useLayerParam } from '../../hooks/useLayerParam'
import { RouteUtils } from '../../utils/route-utils'
import { useNetworkParam } from '../../hooks/useNetworkParam'
import { NetworkSelector } from './NetworkSelector'
import Box from '@mui/material/Box'
import { Network } from '../../../types/network'

export const Header: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const layer = useLayerParam()
  const network = useNetworkParam()

  const isValidNetwork = RouteUtils.getEnabledNetworks().includes(network as any)

  if (!layer) {
    // On search page there's no NetworkHeader
    return (
      <header>
        <Grid
          container
          sx={{ px: isDesktop ? 6 : 4, pb: isMobile ? 4 : 5, pt: 4 }}
          justifyContent={'space-between'}
        >
          <Grid xs="auto">
            <Logotype />
          </Grid>
          <Grid xs={8} sm={6} md={7} lg={8}>
            <Search network={network} variant={isDesktop ? 'button' : 'icon'} />
          </Grid>
        </Grid>
      </header>
    )
  }

  return (
    <header>
      <Grid
        container
        sx={{
          pt: isMobile ? 4 : 0,
          mb: isMobile ? 3 : 6,
          pb: 4,
          px: isMobile ? 4 : '4%',
          backgroundColor: theme.palette.layout.secondary,
        }}
      >
        <Grid md={3} xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Logotype />
        </Grid>
        <Grid md={6} xs={8}>
          {isValidNetwork && <NetworkSelector layer={layer} network={network as Network} />}
        </Grid>
        <Grid md={3} xs={0} />
      </Grid>
      {!isMobile && (
        <Box sx={{ mb: 6, px: isMobile ? 0 : '4%' }}>
          <Search network={network} variant="icon" />
        </Box>
      )}
    </header>
  )
}
