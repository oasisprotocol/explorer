import { ScaleToOptions } from 'react-quick-pinch-zoom'
import { Layer } from '../../../../../config'

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
      case Layer.Emerald:
        return {
          scale: 2,
          x: 0.5 * width,
          y: 0,
        }
      case Layer.Cipher:
        return {
          scale: 2,
          x: width,
          y: 0.4 * height,
        }
      case Layer.Sapphire:
        return {
          scale: 2,
          x: 0.1 * width,
          y: height,
        }
      case Layer.Consensus:
      default:
        return initialValue
    }
  }
}
