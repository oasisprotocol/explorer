import { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Unstable_Grid2'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { useTheme } from '@mui/material/styles'
import { HomePageLink } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
import Box from '@mui/material/Box'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useScreenSize } from '../../hooks/useScreensize'

export const Header: FC = () => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()
  const scope = useScopeParam()
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return (
    <AppBar
      position="sticky"
      sx={{
        transitionProperty: 'background-color',
        transitionDuration: `${theme.transitions.duration.standard}ms`,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        backgroundColor: scrollTrigger
          ? theme.palette.layout.contrastSecondary
          : theme.palette.layout.secondary,
        borderRadius: 0,
        boxShadow: scrollTrigger
          ? '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 34px 24px -9px rgba(50, 77, 171, 0.12)'
          : 'none',
      }}
    >
      <Box sx={{ px: '15px' }}>
        <Grid
          container
          sx={{
            px: isMobile ? 0 : '4%',
            pt: isMobile ? 4 : '15px',
            pb: 4,
          }}
        >
          <Grid md={3} xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <HomePageLink
              color={scrollTrigger ? theme.palette.layout.contrastMain : undefined}
              showText={!scrollTrigger && !isMobile}
            />
          </Grid>
          {scope?.valid && (
            <>
              <Grid lg={6} xs={8}>
                <NetworkSelector layer={scope.layer} network={scope.network} />
              </Grid>
              <Grid lg={3} xs={0} />
            </>
          )}
        </Grid>
      </Box>
    </AppBar>
  )
}
