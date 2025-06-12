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
import { isScopeSelectorNeeded } from '../../utils/route-utils'

export const Header: FC = () => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()
  const scope = useScopeParam()
  const withScopeSelector = !!scope && isScopeSelectorNeeded(scope)
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
        boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
            <HomePageLink showText={!scrollTrigger && !isMobile} color="#0500e2" />
          </Grid>
          {withScopeSelector && (
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
