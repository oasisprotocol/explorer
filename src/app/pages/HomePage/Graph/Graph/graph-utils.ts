import { ScaleToOptions } from 'react-quick-pinch-zoom'
import { Layer } from '../../../../../oasis-nexus/api'
import { exhaustedTypeWarning } from '../../../../../types/errors'
import { SelectorArea, UniverseArea } from '../ParaTimeSelector'

export abstract class GraphUtils {
  static getScaleTo(
    area: SelectorArea,
    { width, height }: { width?: number; height?: number },
  ): ScaleToOptions {
    const initialValue = {
      scale: 1,
      x: 0,
      y: 0,
    }

    if (!width || !height) {
      return initialValue
    }

    switch (area) {
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
      case Layer.sapphire:
        return {
          scale: 2.4,
          x: 0.31 * width,
          y: 1.1 * height,
        }
      case Layer.consensus:
        return {
          scale: 2.4,
          x: 0.65 * width,
          y: 0.65 * height,
        }
      case UniverseArea:
        return initialValue
      default:
        exhaustedTypeWarning('Unexpected area', area)
        return initialValue
    }
  }
}
