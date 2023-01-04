import { GraphEndpoint } from './types'

export abstract class GraphUtils {
  static getSvgViewBox(graphEndpoint: GraphEndpoint): string {
    switch (graphEndpoint) {
      case GraphEndpoint.EMERALD:
        return '120 0 150 150'
      case GraphEndpoint.CIPHER:
        return '220 50 150 150'
      case GraphEndpoint.SAPPHIRE:
        return '50 150 150 150'
      case GraphEndpoint.CONSENSUS:
      default:
        return '0 0 396 326'
    }
  }
}
