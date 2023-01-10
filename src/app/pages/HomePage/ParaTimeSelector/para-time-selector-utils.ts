import { ParaTimeSelectorStep } from './types'
import { GraphEndpoint } from './Graph/types'

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

  static showZoomOutBtn(endpoint: GraphEndpoint) {
    switch (endpoint) {
      case GraphEndpoint.SAPPHIRE:
      case GraphEndpoint.EMERALD:
      case GraphEndpoint.CIPHER:
        return true
      default:
        return false
    }
  }
}
