import { ScaleToOptions } from 'react-quick-pinch-zoom'
import { Layer } from '../../../../../oasis-nexus/api'
import { exhaustedTypeWarning } from '../../../../../types/errors'

export abstract class GraphUtils {
  static getScaleTo(layer: Layer, { width, height }: { width?: number; height?: number }): ScaleToOptions {
    const initialValue = {
      scale: 1,
      x: 0,
      y: 0,
    }

    if (!width || !height) {
      return initialValue
    }

    switch (layer) {
      case Layer.emerald:
        return {
          scale: 2.4,
          x: 0.68 * width,
          y: 0.1 * height,
        }
      case Layer.cipher:
        return {
          scale: 2.4,
          x: 1.2 * width,
          y: 0.7 * height,
        }
      case Layer.pontusx:
        // TODO: update this if/when we want to display this layer
        // We meed this case here since this switch/case is declared to be exhaustive.
        return initialValue
      case Layer.sapphire:
        return {
          scale: 2.4,
          x: 0.31 * width,
          y: 1.1 * height,
        }
      case Layer.consensus:
        return initialValue
      default:
        exhaustedTypeWarning('Unexpected layer', layer)
        return initialValue
    }
  }
}
