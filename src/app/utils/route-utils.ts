import { ParaTime } from '../../config'

export abstract class RouteUtils {
  private static ENABLED_PARA_TIMES: ParaTime[] = [ParaTime.Emerald, ParaTime.Sapphire, ParaTime.Cipher]
  static getBlockRoute = (blockHeight: number) => `/blocks/${blockHeight}`

  static getEnabledParaTimes(): ParaTime[] {
    return RouteUtils.ENABLED_PARA_TIMES
  }
}
