import { Gain } from './types'

export abstract class PercentageGainUtils {
  static getGainFromPercentage(percentage: number) {
    return percentage >= 0 ? Gain.POSITIVE : Gain.NEGATIVE;
  }

  static getColorFromGain(gain: Gain) {
    switch (gain) {
      case Gain.NEGATIVE:
        return 'error';
      case Gain.POSITIVE:
      default:
        return 'success';
    }
  }
}
