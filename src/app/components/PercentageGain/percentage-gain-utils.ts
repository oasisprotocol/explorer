import { Gain } from './types'

export const getGainFromPercentage = (percentage: number) => {
  return percentage >= 0 ? Gain.POSITIVE : Gain.NEGATIVE
}
