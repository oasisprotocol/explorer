import { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { useTheme } from '@mui/material/styles'
import { HomePageLink } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
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
      <div className="px-4">
        <div className="grid grid-cols-12 pt-3 pb-4 px-0 md:px-[4%]">
          <div className="col-span-6 xl:col-span-3 flex items-center">
            <HomePageLink showText={!scrollTrigger && !isMobile} color="#0500e2" />
          </div>

          {withScopeSelector && (
            <div className="col-span-6 xl:col-span-6 flex justify-end xl:justify-center items-center">
              <NetworkSelector layer={scope.layer} network={scope.network} />
            </div>
          )}

          {isDesktop && (
            <div className="col-span-3 flex justify-end items-center">
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
        </div>
      </div>
    </AppBar>
  )
}
