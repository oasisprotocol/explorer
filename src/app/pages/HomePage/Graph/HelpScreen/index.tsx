import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../../../styles/theme/colors'
import { useConstant } from '../../../../hooks/useConstant'
import Button from '@mui/material/Button'
import { ParaTimeSelectorStep } from '../types'
import { SlideChangeEvent } from '../../../../../types/swiper'
import { storage } from '../../../../utils/storage'
import { StorageKeys } from '../../../../../types/storage'
import { TapIcon } from '../../../../components/CustomIcons/Tap'
import { PinchIcon } from '../../../../components/CustomIcons/Pinch'
import { NavigateIcon } from '../../../../components/CustomIcons/Navigate'
import { Theme } from '@mui/material/styles/createTheme'

const HelpScreenContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '65%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyItems: 'flex-end',
  minHeight: '185px',
  width: '90%',
  height: '100%',
}))

const SwiperBox = styled(Box)(() => ({
  width: '100%',
  height: '40%',
}))

export const GetStartedBtn = styled(Button)({})
GetStartedBtn.defaultProps = {
  variant: 'contained',
  color: 'primary',
}

interface Step {
  icon: ReactElement
  label: string
}

const iconSx = (theme: Theme) => ({
  overflow: 'hidden',
  margin: `0 auto ${theme.spacing(3)}`,
  fontSize: 50,
  color: theme.palette.layout.main,
})

const steps = (t: TFunction): Step[] => [
  {
    icon: <NavigateIcon sx={iconSx} />,
    label: t('home.helpScreen.navigate'),
  },
  {
    icon: <PinchIcon sx={iconSx} />,
    label: t('home.helpScreen.pinch'),
  },
  {
    icon: <TapIcon sx={iconSx} />,
    label: t('home.helpScreen.tap'),
  },
]

type AvailableSteps = 0 | 1 | 2

interface HelpScreenProps {
  setParaTimeStep: (value: ParaTimeSelectorStep) => void
}

const localStore = storage()

const HelpScreen: FC<HelpScreenProps> = ({ setParaTimeStep }) => {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState<AvailableSteps>(0)
  const allSteps = useConstant(() => steps(t))
  const totalSteps = allSteps.length
  const currentStep = allSteps[activeStep]

  const swiperElRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleSlideChange = (e: SlideChangeEvent) => {
      const [swiper] = e.detail
      setActiveStep(swiper.activeIndex as AvailableSteps)
    }

    const swiperEl = swiperElRef.current
    swiperEl?.addEventListener<'slidechange'>('slidechange', handleSlideChange)

    return () => {
      swiperEl?.removeEventListener<'slidechange'>('slidechange', handleSlideChange)
    }
  }, [])

  const onGetStartedClick = () => {
    setParaTimeStep(ParaTimeSelectorStep.Explore)

    localStore.set(StorageKeys.MobileHelpScreenShown, true)
  }

  return (
    <HelpScreenContainer>
      <SwiperBox>
        <swiper-container style={{ height: '100%' }} ref={swiperElRef} slides-per-view="1">
          {allSteps.map(({ icon, label }, index) => (
            <swiper-slide
              style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              key={label}
            >
              {Math.abs(activeStep - index) < totalSteps ? <>{icon}</> : null}
            </swiper-slide>
          ))}
        </swiper-container>
      </SwiperBox>
      <Typography
        variant="h4"
        color={COLORS.white}
        sx={theme => ({ marginBottom: 5, color: theme.palette.layout.main })}
      >
        {currentStep.label}
      </Typography>
      {activeStep < 2 && (
        <MobileStepper
          variant="dots"
          steps={totalSteps}
          position="static"
          activeStep={activeStep}
          backButton={null}
          nextButton={null}
        />
      )}
      {activeStep > 1 && (
        <GetStartedBtn onClick={onGetStartedClick}>{t('home.helpScreen.getStarted')}</GetStartedBtn>
      )}
    </HelpScreenContainer>
  )
}

export default HelpScreen
