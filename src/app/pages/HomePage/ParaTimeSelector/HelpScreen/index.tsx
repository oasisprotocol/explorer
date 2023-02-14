import { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import helpScreenNavigate from '../images/help-screen-navigate.svg'
import helpScreenPinch from '../images/help-screen-pinch.svg'
import helpScreenTap from '../images/help-screen-tap.svg'
import { TFunction } from 'i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../../../styles/theme/colors'
import { useConstant } from '../../../../hooks/useConstant'
import Button from '@mui/material/Button'
import { ParaTimeSelectorStep } from '../types'
import Swiper from 'swiper/types/swiper-class'

// declaration in d.ts file declaration not correctly recognized
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

interface SlideChangeEvent extends Event {
  detail: [Swiper]
}

const HelpScreenContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '65%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '185px',
  width: '90%',
}))

const SwiperBox = styled(Box)(() => ({
  width: '100%',
}))

interface Step {
  icon: string
  label: string
}

const steps = (t: TFunction): Step[] => [
  {
    icon: helpScreenNavigate,
    label: t('home.helpScreen.navigate'),
  },
  {
    icon: helpScreenPinch,
    label: t('home.helpScreen.pinch'),
  },
  {
    icon: helpScreenTap,
    label: t('home.helpScreen.tap'),
  },
]

type AvailableSteps = 0 | 1 | 2

interface HelpScreenProps {
  setParaTimeStep: (value: ParaTimeSelectorStep) => void
}

const HelpScreen: FC<HelpScreenProps> = ({ setParaTimeStep }) => {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState<AvailableSteps>(0)
  const allSteps = useConstant(() => steps(t))
  const totalSteps = allSteps.length
  const currentStep = allSteps[activeStep]

  const swiperElRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleSlideChange = (e: Event) => {
      const [swiper] = (e as SlideChangeEvent).detail
      setActiveStep(swiper.activeIndex as AvailableSteps)
    }

    swiperElRef.current?.addEventListener('slidechange', handleSlideChange)

    return () => {
      swiperElRef.current?.removeEventListener('slidechange', handleSlideChange)
    }
  }, [])

  const onChangeSwipeableIndex = (index: number) => {
    setActiveStep(index as AvailableSteps)
  }

  const onGetStartedClick = () => {
    setParaTimeStep(ParaTimeSelectorStep.Explore)
  }

  return (
    <HelpScreenContainer>
      <SwiperBox>
        <swiper-container ref={swiperElRef} slides-per-view="1">
          {allSteps.map((step, index) => (
            <swiper-slide key={step.label}>
              {Math.abs(activeStep - index) < totalSteps ? (
                <Box
                  component="img"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 50,
                    overflow: 'hidden',
                    marginBottom: 3,
                  }}
                  src={step.icon}
                  alt={step.label}
                />
              ) : null}
            </swiper-slide>
          ))}
        </swiper-container>
      </SwiperBox>
      <Typography component="h4" color={COLORS.white} sx={{ marginBottom: 5 }}>
        {currentStep.label}
      </Typography>
      {activeStep < 2 && (
        <MobileStepper
          variant="dots"
          steps={totalSteps}
          position="static"
          activeStep={activeStep}
          backButton={<></>}
          nextButton={<></>}
        />
      )}
      {activeStep > 1 && (
        <Button variant="contained" color="primary" onClick={onGetStartedClick}>
          {t('home.helpScreen.getStarted')}
        </Button>
      )}
      ss
    </HelpScreenContainer>
  )
}

export default HelpScreen
