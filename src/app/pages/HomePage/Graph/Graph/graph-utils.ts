import { ScaleToOptions } from 'react-quick-pinch-zoom'
import { Layer } from '../../../../../oasis-indexer/api'

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
          scale: 2,
          x: 0.57 * width,
          y: 0,
        }
      case Layer.cipher:
        return {
          scale: 2,
          x: width,
          y: 0.4 * height,
        }
      case Layer.sapphire:
        return {
          scale: 2,
          x: 0.15 * width,
          y: height,
        }
      case Layer.consensus:
      default:
        return initialValue
    }
  }
}
