import { FC, useState } from 'react'
import { Logotype } from '../../components/PageLayout/Logotype'
import background from './images/background.svg'
import { COLORS } from '../../../styles/theme/colors'
import { Search } from '../../components/Search'
import { ParaTimeSelector } from './Graph/ParaTimeSelector'
import { Footer } from '../../components/PageLayout/Footer'
import { useScreenSize } from '../../hooks/useScreensize'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import { ParaTimeSelectorStep } from './Graph/types'
import { BuildBanner } from '../../components/BuildBanner'
import { useSearchQueryNetworkParam } from '../../hooks/useSearchQueryNetworkParam'
import { ThemeByScope } from '../../components/ThemeByScope'
import { NetworkOfflineBanner } from '../../components/OfflineBanner'
import { useIsApiReachable } from '../../components/OfflineBanner/hook'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

export const zIndexHomePage = {
  paraTimeSelector: 1,
  searchInput: 2,
  logo: 3,
  mobileTooltip: 4,
}

export const HomePage: FC = () => {
  const { t } = useTranslation()
  const infoAriaLabel = t('home.helpScreen.infoIconAria')
  const { isMobile } = useScreenSize()
  const { network } = useSearchQueryNetworkParam()
  const isApiReachable = useIsApiReachable(network).reachable

  const [searchHasFocus, setSearchHasFocus] = useState(false)
  const [isGraphZoomedIn, setIsGraphZoomedIn] = useState(false)
  const [step, setStep] = useState<ParaTimeSelectorStep>(() => {
    if (isMobile) {
      return ParaTimeSelectorStep.EnableExplore
    }

    return ParaTimeSelectorStep.Explore
  })
  const [showInfoScreen, setShowInfoScreen] = useState<boolean>(false)

  const onFocusChange = (hasFocus: boolean) => {
    setSearchHasFocus(hasFocus)
  }

  const onToggleInfoScreenClick = () => {
    setStep(ParaTimeSelectorStep.ShowHelpScreen)
    setShowInfoScreen(true)
  }

  const showInfoScreenBtn = isMobile && step !== ParaTimeSelectorStep.ShowHelpScreen

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner wantedNetwork={network} />
      <div
        className="relative flex flex-col w-screen max-w-full min-h-screen overflow-x-hidden sm:h-screen sm:min-h-[800px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="relative flex flex-col justify-start items-center flex-1 px-4 sm:justify-end">
          <div className="z-30 mb-10 mt-15 text-center sm:mb-15 sm:mt-0">
            <Logotype showText />
          </div>
          <div
            className={cn(
              'relative z-20 w-full md:w-auto',
              isGraphZoomedIn && !searchHasFocus && 'md:opacity-50 md:hover:opacity-100',
            )}
          >
            <div className="w-full mx-auto sm:w-[75vw] md:w-[50vw]">
              <Search disabled={!isApiReachable} onFocusChange={onFocusChange} />
            </div>
            {showInfoScreenBtn && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={infoAriaLabel}
                onClick={onToggleInfoScreenClick}
                className={`hover:bg-black/[0.04] rounded-full absolute top-16 z-[${zIndexHomePage.paraTimeSelector}]`}
              >
                <InfoOutlinedIcon fontSize="medium" sx={{ color: COLORS.grayMedium2 }} />
              </Button>
            )}
          </div>
          <ThemeByScope network={network}>
            <div className="z-0">
              <ParaTimeSelector
                step={step}
                setStep={setStep}
                disabled={searchHasFocus}
                showInfoScreen={showInfoScreen}
                graphZoomedIn={isGraphZoomedIn}
                onGraphZoomedIn={setIsGraphZoomedIn}
              />
            </div>
          </ThemeByScope>
        </div>
        <div className="w-full flex-none align-center px-16 md:z-10">
          <Footer enableMobileSearch={false} />
        </div>
      </div>
    </>
  )
}
