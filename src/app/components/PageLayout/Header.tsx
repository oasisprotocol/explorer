import { FC } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { NetworkHeader } from './NetworkHeader'

export const Header: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <header>
      <Grid container sx={{ px: isMobile ? 4 : 6, pb: isMobile ? 4 : 5 }}>
        <Grid md={12} xs={6} sx={{ pb: isMobile ? 0 : '50px' }}>
          <Logotype />
        </Grid>
        <Grid xs={6} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <NetworkHeader />
        </Grid>
        <Grid xs={8}>{/* Search Placeholder */}</Grid>
      </Grid>
    </header>
  )
}
