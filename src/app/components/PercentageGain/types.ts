import { ArrowDirection } from '../../icons/types'

export enum Gain {
  POSITIVE,
  NEGATIVE,
}

export const GainToArrowDirectionMap: { [key in Gain]: ArrowDirection } = {
  [Gain.POSITIVE]: ArrowDirection.UP,
  [Gain.NEGATIVE]: ArrowDirection.DOWN,
}
