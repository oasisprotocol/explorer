import { FC } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { NetworkHeader } from './NetworkHeader'
import { Search } from '../Search'
import { useLayerParam } from '../../hooks/useLayerParam'

export const Header: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const layer = useLayerParam()

  if (!layer) {
    // On search page there's no NetworkHeader
    return (
      <header>
        <Grid container sx={{ px: isDesktop ? 6 : 4, pb: isMobile ? 4 : 5 }} justifyContent={'space-between'}>
          <Grid xs="auto">
            <Logotype />
          </Grid>
          <Grid xs={8} sm={6} md={7} lg={8}>
            <Search variant={isDesktop ? 'button' : 'icon'} />
          </Grid>
        </Grid>
      </header>
    )
  }

  return (
    <header>
      <Grid container sx={{ px: isDesktop ? 6 : 4, pb: isMobile ? 4 : 5 }}>
        <Grid md={12} xs={6} sx={{ pb: isTablet ? 0 : '50px' }}>
          <Logotype />
        </Grid>
        <Grid
          xs={6}
          md={6}
          lg={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pr: isMobile ? 0 : 3,
            pb: isTablet && !isMobile ? 3 : 0,
          }}
        >
          <NetworkHeader layer={layer} />
        </Grid>
        {!isMobile && (
          <Grid
            xs={12}
            sm={12}
            md={6}
            lg={8}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Search variant="icon" />
          </Grid>
        )}
      </Grid>
    </header>
  )
}
