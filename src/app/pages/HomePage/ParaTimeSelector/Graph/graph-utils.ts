import { GraphEndpoint } from './types'

export abstract class GraphUtils {
  static getSvgTransform(graphEndpoint: GraphEndpoint): string {
    switch (graphEndpoint) {
      case GraphEndpoint.EMERALD:
        return 'scale3d(2, 2, 2) translate3d(1%, 25%, 0)'
      case GraphEndpoint.CIPHER:
        return 'scale3d(2, 2, 2) translate3d(-33%, 10%, 0)'
      case GraphEndpoint.SAPPHIRE:
        return 'scale3d(2, 2, 2) translate3d(23%, -20%, 0)'
      case GraphEndpoint.CONSENSUS:
      default:
        return 'scale3d(1, 1, 1)'
    }
  }
}
