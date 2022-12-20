import { Gain } from './types'

export abstract class PercentageGainUtils {
  static getGainFromPercentage(percentage: number) {
    return percentage >= 0 ? Gain.POSITIVE : Gain.NEGATIVE;
  }

}
