import { FC } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
import { useScopeParam } from '../../hooks/useScopeParam'

export const Header: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const scope = useScopeParam()

  if (!scope) {
    // On home-page and global search page there's no NetworkHeader
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
        </Grid>
      </header>
    )
  }

  return (
    <header>
      <Grid
        container
        sx={{
          px: isMobile ? 0 : '4%',
          pt: isMobile ? 4 : '15px',
          pb: 4,
          backgroundColor: theme.palette.layout.secondary,
        }}
      >
        <Grid md={3} xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Logotype />
        </Grid>
        <Grid md={6} xs={8}>
          <NetworkSelector layer={scope.layer} network={scope.network} />
        </Grid>
        <Grid md={3} xs={0} />
      </Grid>
    </header>
  )
}
