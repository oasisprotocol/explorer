import { keyframes } from '@mui/material/styles'
import { COLORS } from './colors'
import { REFETCH_INTERVAL } from '../../app/config'

const backgroundColorKeyframes = keyframes`
  0% {
    background-color: ${COLORS.white}
  }
  20% {
    background-color: ${COLORS.lightGreen}
  }
  80% {
    background-color: ${COLORS.lightGreen}
  }
  100% {
    background-color: ${COLORS.white}
  }
`

const backgroundColorAnimationDuration = `${Math.max(500, REFETCH_INTERVAL - 2000)}ms`

export const backgroundColorAnimation = {
  animationName: backgroundColorKeyframes,
  animationDuration: backgroundColorAnimationDuration,
  animationIterationCount: 1,
  animationTimingFunction: 'ease-in-out',
}
