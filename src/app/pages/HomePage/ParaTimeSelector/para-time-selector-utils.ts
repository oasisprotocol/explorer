import { ParaTimeSelectorStep } from './types'
import { Layer } from '../../../../config'

export abstract class ParaTimeSelectorUtils {
  static getIsGraphTransparent(step: ParaTimeSelectorStep) {
    return step !== ParaTimeSelectorStep.Explore
  }

  static showExploreBtn(step: ParaTimeSelectorStep) {
    return step === ParaTimeSelectorStep.EnableExplore
  }

  static showMobileHelpScreen(step: ParaTimeSelectorStep, isMobile: boolean) {
    if (!isMobile) {
      return false
    }

    return step === ParaTimeSelectorStep.ShowHelpScreen
  }

  static showZoomOutBtn(isMobile: boolean, layer?: Layer) {
    if (isMobile) {
      return false
    }

    switch (layer) {
      case Layer.Sapphire:
      case Layer.Emerald:
      case Layer.Cipher:
        return true
      default:
        return false
    }
  }
}
