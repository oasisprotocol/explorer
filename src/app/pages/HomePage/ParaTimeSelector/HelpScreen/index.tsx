import { FC, useState } from 'react'
import { ParaTimeHelpScreenStep } from '../types'
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

const HelpScreenContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
}))

const Stepper = styled(Box)(() => ({}))

interface Step {
  icon: string
  label: string
}

const steps = (t: TFunction): { [key in ParaTimeHelpScreenStep]: Step } => ({
  [ParaTimeHelpScreenStep.Step1]: {
    icon: helpScreenNavigate,
    label: t('home.helpScreen.navigate'),
  },
  [ParaTimeHelpScreenStep.Step2]: {
    icon: helpScreenPinch,
    label: t('home.helpScreen.pinch'),
  },
  [ParaTimeHelpScreenStep.Step3]: {
    icon: helpScreenTap,
    label: t('home.helpScreen.tap'),
  },
})

const HelpScreen: FC = () => {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState(0)
  const [step, setStep] = useState<ParaTimeHelpScreenStep>(ParaTimeHelpScreenStep.Step1)

  const currentStep = steps(t)[step]

  return (
    <HelpScreenContainer>
      <img src={currentStep.icon} alt={currentStep.label} />
      <Typography component="h4" color={COLORS.white} sx={{ fontSize: '12px' }}>
        {currentStep.label}
      </Typography>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: 400, flexGrow: 1 }}
        backButton={<></>}
        nextButton={<></>}
      />
    </HelpScreenContainer>
  )
}

export default HelpScreen
