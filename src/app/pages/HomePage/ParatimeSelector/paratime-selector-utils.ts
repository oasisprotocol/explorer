import { ParatimeSelectorStep } from './types'

export abstract class ParatimeSelectorUtils {
  static getIsGraphTransparent(step: ParatimeSelectorStep) {
    switch (step) {
      case ParatimeSelectorStep.EXPLORE:
        return false
      default:
        return true
    }
  }

  static showExploreBtn(step: ParatimeSelectorStep) {
    switch (step) {
      case ParatimeSelectorStep.ENABLE_EXPLORE:
        return true
      default:
        return false
    }
  }
}
