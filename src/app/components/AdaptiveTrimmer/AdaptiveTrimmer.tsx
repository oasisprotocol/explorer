import { FC, ReactNode } from 'react'
import { AdaptiveDynamicTrimmer } from './AdaptiveDynamicTrimmer'
import { trimLongString } from 'app/utils/trimLongString'

type AdaptiveTrimmerProps = {
  text: string | undefined
  strategy: 'middle' | 'end'

  /**
   * Normally, the tooltip will be the text. Do you want to add something extra?
   */
  extraTooltip?: ReactNode

  /**
   * Normally, the tooltip will be the text. Do you want to replace it with something else?
   */
  tooltipOverride?: ReactNode
}

/**
 * Display content, potentially shortened as needed.
 *
 * This component will do automatic detection of available space,
 * and determine the best way to display content accordingly.
 *
 * The implementation is based on AdaptiveDynamicTrimmer,
 * supplying it with a generator function which simply trims the given text to the wanted length.
 */
export const AdaptiveTrimmer: FC<AdaptiveTrimmerProps> = ({
  text = '',
  strategy = 'end',
  extraTooltip,
  tooltipOverride,
}) => (
  <AdaptiveDynamicTrimmer
    getFullContent={() => ({ content: text, length: text.length })}
    getShortenedContent={length =>
      strategy === 'middle'
        ? trimLongString(text, Math.floor(length / 2) - 1, Math.floor(length / 2) - 1)!
        : trimLongString(text, length, 0)!
    }
    tooltipOverride={tooltipOverride}
    extraTooltip={extraTooltip}
  />
)
