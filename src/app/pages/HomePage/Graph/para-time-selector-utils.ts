import { ParaTimeSelectorStep } from './types'
import { storage } from '../../../utils/storage'
import { StorageKeys } from '../../../../types/storage'

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
}
