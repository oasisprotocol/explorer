import { FC } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
import Box from '@mui/material/Box'
import { useScopeParam } from '../../hooks/useScopeParam'

export const Header: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const scope = useScopeParam()

  return (
    <header>
      <Box sx={{ px: '15px' }}>
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
          {scope && (
            <>
              <Grid md={6} xs={8}>
                <NetworkSelector layer={scope.layer} network={scope.network} />
              </Grid>
              <Grid md={3} xs={0} />
            </>
          )}
        </Grid>
      </Box>
    </header>
  )
}
