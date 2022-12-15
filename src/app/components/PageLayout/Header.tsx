import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import { Logotype } from './Logotype'
import { NetworkHeader } from './NetworkHeader'

export function Header() {
  return (
    <header>
      <Grid container sx={{ px: 6, pb: 5 }}>
        <Grid xs={12} sx={{ pb: '50px' }}>
          <Logotype />
        </Grid>
        <Grid xs={4}>
          <NetworkHeader />
        </Grid>
        <Grid xs={8}>{/* Search Placeholder */}</Grid>
      </Grid>
    </header>
  )
}
