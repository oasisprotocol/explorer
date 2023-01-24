import { FC } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { NetworkHeader } from './NetworkHeader'
import { Search } from '../Search'

export const Header: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <header>
      <Grid container sx={{ px: isDesktop ? 6 : 4, pb: isMobile ? 4 : 5 }}>
        <Grid md={12} xs={6} sx={{ pb: isMobile ? 0 : '50px' }}>
          <Logotype />
        </Grid>
        <Grid xs={6} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <NetworkHeader />
        </Grid>
        {!isMobile && (
          <Grid sm={12} md={8}>
            <Search variant="icon" />
          </Grid>
        )}
      </Grid>
    </header>
  )
}
