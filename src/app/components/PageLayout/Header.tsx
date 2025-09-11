import { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Unstable_Grid2'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { useTheme } from '@mui/material/styles'
import { HomePageLink } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useScreenSize } from '../../hooks/useScreensize'
import { isScopeSelectorNeeded } from '../../utils/route-utils'
import { useTranslation } from 'react-i18next'

export const Header: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const { isDesktop } = useScreenSize()
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
      <div className="px-[15px]">
        <Grid
          container
          sx={{
            px: isMobile ? 0 : '4%',
            pt: isMobile ? 4 : '15px',
            pb: 4,
          }}
        >
          <div className="w-1/3 lg:w-1/4 flex items-center">
            <HomePageLink showText={!scrollTrigger && !isMobile} color="#0500e2" />
          </div>
          {withScopeSelector && (
            <>
              <div className="w-2/3 lg:w-1/2">
                <NetworkSelector layer={scope.layer} network={scope.network} />
              </div>
            </>
          )}
          {isDesktop && (
            <div className="w-1/3 lg:w-1/4 flex justify-end">
              <Button
                component="a"
                href="https://rose.oasis.io/"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                variant="outlined"
                size="large"
              >
                {t('common.visitRoseApp')}
              </Button>
            </div>
          )}
        </Grid>
      </div>
    </AppBar>
  )
}
