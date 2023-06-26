import { ParaTimeSelectorStep } from './types'
import { Layer } from '../../../../oasis-indexer/api'
import { storage } from '../../../utils/storage'
import { StorageKeys } from '../../../../types/storage'
import { exhaustedTypeWarning } from '../../../../types/errors'

const localStore = storage()

export abstract class ParaTimeSelectorUtils {
  static getIsGraphTransparent(step: ParaTimeSelectorStep) {
    return step !== ParaTimeSelectorStep.Explore
  }

  static showExploreBtn(step: ParaTimeSelectorStep) {
    return step === ParaTimeSelectorStep.EnableExplore
  }

  static showMobileHelpScreen(step: ParaTimeSelectorStep, isMobile: boolean, showInfoScreen: boolean) {
    const mobileHelpScreenShown = localStore.get(StorageKeys.MobileHelpScreenShown)

    if (!showInfoScreen && (!isMobile || mobileHelpScreenShown)) {
      return false
    }

    return step === ParaTimeSelectorStep.ShowHelpScreen
  }

  static showZoomOutBtn(isMobile: boolean, layer?: Layer) {
    if (isMobile) {
      return false
    }

    switch (layer) {
      case Layer.sapphire:
      case Layer.emerald:
      case Layer.cipher:
        return true
      case Layer.consensus:
      case undefined:
        return false
      default:
        exhaustedTypeWarning('Unexpected layer', layer)
        return false
    }
  }
}
