import { FC } from 'react'
import { useScrolled } from '../../hooks/useScrolled'
import { HomePageLink } from './Logotype'
import { NetworkSelector } from './NetworkSelector'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { useScopeParam } from '../../hooks/useScopeParam'
import { useScreenSize } from '../../hooks/useScreensize'
import { isScopeSelectorNeeded } from '../../utils/route-utils'
import { useTranslation } from 'react-i18next'

export const Header: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const { isDesktop } = useScreenSize()
  const scope = useScopeParam()
  const withScopeSelector = !!scope && isScopeSelectorNeeded(scope)
  const scrolled = useScrolled()

  return (
    <header className="flex flex-col w-full box-border flex-shrink-0 sticky z-[1100] top-0 right-0 left-auto shadow-md bg-theme-layout-accent">
      <div className="px-4">
        <div className="grid grid-cols-12 pt-3 pb-4 px-0 md:px-[4%]">
          <div className="col-span-6 xl:col-span-3 flex items-center">
            <HomePageLink showText={!scrolled && !isMobile} />
          </div>

          {withScopeSelector && (
            <div className="col-span-6 xl:col-span-6 flex justify-end xl:justify-center items-center">
              <NetworkSelector layer={scope.layer} network={scope.network} />
            </div>
          )}

          {isDesktop && (
            <div className="xl:col-start-10 xl:col-span-3 flex justify-end items-center">
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
