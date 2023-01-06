import { GraphEndpoint } from './types'

export abstract class GraphUtils {
  static getSvgTransform(graphEndpoint: GraphEndpoint): string {
    switch (graphEndpoint) {
      case GraphEndpoint.EMERALD:
        return 'scale(2) translate(1%, 25%)'
      case GraphEndpoint.CIPHER:
        return 'scale(2) translate(-33%, 10%)'
      case GraphEndpoint.SAPPHIRE:
        return 'scale(2) translate(23%, -20%)'
      case GraphEndpoint.CONSENSUS:
      default:
        return 'scale(1)'
    }
  }
}
