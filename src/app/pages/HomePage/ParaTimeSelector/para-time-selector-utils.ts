import { ParaTimeSelectorStep } from './types'

export abstract class ParaTimeSelectorUtils {
  static getIsGraphTransparent(step: ParaTimeSelectorStep) {
    switch (step) {
      case ParaTimeSelectorStep.EXPLORE:
        return false
      default:
        return true
    }
  }

  static showExploreBtn(step: ParaTimeSelectorStep) {
    switch (step) {
      case ParaTimeSelectorStep.ENABLE_EXPLORE:
        return true
      default:
        return false
    }
  }
}
