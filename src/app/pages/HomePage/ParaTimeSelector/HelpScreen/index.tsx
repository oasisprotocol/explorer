import { FC, useState } from 'react'
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
import SwipeableViews from 'react-swipeable-views'

const HelpScreenContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '90%',
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

const HelpScreen: FC = () => {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState<AvailableSteps>(0)
  const allSteps = useConstant(() => steps(t))
  const totalSteps = allSteps.length
  const currentStep = allSteps[activeStep]

  const onChangeSwipeableViewsIndex = (index: number) => {
    setActiveStep(index as AvailableSteps)
  }

  return (
    <HelpScreenContainer>
      <SwipeableViews index={activeStep} onChangeIndex={onChangeSwipeableViewsIndex}>
        {allSteps.map((step, index) => (
          <div key={step.label}>
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
          </div>
        ))}
      </SwipeableViews>
      <Typography component="h4" color={COLORS.white} sx={{ marginBottom: 5 }}>
        {currentStep.label}
      </Typography>
      <MobileStepper
        variant="dots"
        steps={totalSteps}
        position="static"
        activeStep={activeStep}
        backButton={<></>}
        nextButton={<></>}
      />
    </HelpScreenContainer>
  )
}

export default HelpScreen
