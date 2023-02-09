import { ParaTimeSelectorStep } from './types'
import { GraphEndpoint } from './Graph/types'

export abstract class ParaTimeSelectorUtils {
  static getIsGraphTransparent(step: ParaTimeSelectorStep) {
    switch (step) {
      case ParaTimeSelectorStep.Explore:
        return false
      default:
        return true
    }
  }

  static showExploreBtn(step: ParaTimeSelectorStep) {
    switch (step) {
      case ParaTimeSelectorStep.EnableExplore:
        return true
      default:
        return false
    }
  }

  static showMobileHelpScreen(step: ParaTimeSelectorStep, isMobile: boolean) {
    if (!isMobile) {
      return false
    }

    switch (step) {
      case ParaTimeSelectorStep.ShowHelpScreen:
        return true
      default:
        return false
    }
  }

  static showZoomOutBtn(isMobile: boolean, endpoint?: GraphEndpoint) {
    if (isMobile) {
      return false
    }

    switch (endpoint) {
      case GraphEndpoint.Sapphire:
      case GraphEndpoint.Emerald:
      case GraphEndpoint.Cipher:
        return true
      default:
        return false
    }
  }
}
