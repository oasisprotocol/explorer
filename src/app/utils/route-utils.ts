import { ParaTime } from '../../config'

export abstract class RouteUtils {
  private static ENABLED_PARA_TIMES: ParaTime[] = [ParaTime.Emerald, ParaTime.Sapphire, ParaTime.Cipher]

  static getDashboardRoute = (paraTime: ParaTime) => {
    return `/${paraTime}`
  }

  static getLatestTransactionsRoute = (paraTime: ParaTime) => {
    return `/${paraTime}/transactions`
  }

  static getLatestBlocksRoute = (paraTime: ParaTime) => {
    return `/${paraTime}/blocks`
  }

  static getBlockRoute = (blockHeight: number, paraTime: ParaTime | null = null) => {
    return `${paraTime ? `/${paraTime}` : ''}/blocks/${encodeURIComponent(blockHeight)}`
  }

  static getTransactionRoute = (txHash: string, paraTime: ParaTime | null = null) => {
    return `${paraTime ? `/${paraTime}` : ''}/transactions/${encodeURIComponent(txHash)}`
  }

  static getAccountRoute = (sender: string, paraTime: ParaTime | null = null) => {
    return `${paraTime ? `/${paraTime}` : ''}/account/${encodeURIComponent(sender)}`
  }

  static getEnabledParaTimes(): ParaTime[] {
    return RouteUtils.ENABLED_PARA_TIMES
  }
}
