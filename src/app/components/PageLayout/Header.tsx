import { FC, useLayoutEffect, useRef } from 'react'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Unstable_Grid2'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
import Box from '@mui/material/Box'
import { useScopeParam } from '../../hooks/useScopeParam'
import { BuildBanner } from '../BuildBanner'
import { NetworkOfflineBanner, RuntimeOfflineBanner } from '../OfflineBanner'
import Alert from '@mui/material/Alert'
import { useScreenSize } from '../../hooks/useScreensize'

export const Header: FC = () => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()
  const scope = useScopeParam()
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })
  const buildBannerRef = useRef<(typeof Alert & HTMLElement) | null>(null)
  const networkOfflineBannerRef = useRef<(typeof Alert & HTMLElement) | null>(null)
  const runtimeOfflineBannerRef = useRef<(typeof Alert & HTMLElement) | null>(null)

  useLayoutEffect(() => {
    if (!isMobile) {
      return
    }

    const bodyStyles = document.body.style

    if (buildBannerRef.current !== null) {
      const buildBannerHeight = buildBannerRef.current?.clientHeight
      bodyStyles.setProperty('--app-build-banner-height', `${buildBannerHeight?.toFixed(2) || 0}px`)
    }

    if (networkOfflineBannerRef.current !== null) {
      const networkOfflineBannerHeight = networkOfflineBannerRef.current?.clientHeight
      bodyStyles.setProperty(
        '--app-network-offline-banner-height',
        `${networkOfflineBannerHeight?.toFixed(2) || 0}px`,
      )
    }

    if (runtimeOfflineBannerRef.current !== null) {
      const runtimeOfflineBannerHeight = runtimeOfflineBannerRef.current?.clientHeight
      bodyStyles.setProperty(
        '--app-runtime-offline-banner-height',
        `${runtimeOfflineBannerHeight?.toFixed(2) || 0}px`,
      )
    }
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
      <BuildBanner ref={buildBannerRef} />
      <NetworkOfflineBanner ref={networkOfflineBannerRef} />
      {scope && <RuntimeOfflineBanner ref={runtimeOfflineBannerRef} />}
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
            <Logotype
              color={scrollTrigger ? theme.palette.layout.contrastMain : undefined}
              showText={!scrollTrigger && !isMobile}
            />
          </Grid>
          {scope && (
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
