import { FC } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { useTheme } from '@mui/material/styles'
import { HomePageLink } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
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
    <header
      className="flex flex-col w-full box-border flex-shrink-0 sticky z-[1100] top-0 right-0 left-auto transition-colors duration-300 ease-in-out shadow-md"
      style={{
        backgroundColor: scrollTrigger
          ? theme.palette.layout.contrastSecondary
          : theme.palette.layout.secondary,
      }}
    >
      <div className="px-4">
        <div className="grid grid-cols-12 pt-3 pb-4 px-0 md:px-[4%]">
          <div className="col-span-6 xl:col-span-3 flex items-center">
            <HomePageLink showText={!scrollTrigger && !isMobile} />
          </div>

          {withScopeSelector && (
            <div className="col-span-6 xl:col-span-6 flex justify-end xl:justify-center items-center">
              <NetworkSelector layer={scope.layer} network={scope.network} />
            </div>
          )}

          {isDesktop && (
            <div className="col-span-3 flex justify-end items-center">
              <Button variant="outline" size="lg" asChild>
                <a href="https://rose.oasis.io/" target="_blank" rel="noopener noreferrer">
                  {t('common.visitRoseApp')}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
