import { FC, ReactNode } from 'react'
import { AdaptiveDynamicTrimmer } from './AdaptiveDynamicTrimmer'
import { trimLongString } from 'app/utils/trimLongString'

type AdaptiveTrimmerProps = {
  /**
   * ID prefix to use (for debugging)
   */
  idPrefix?: string

  text: string | undefined
  strategy: 'middle' | 'end'

  /**
   * The minimum length we ever want to shorten to.
   *
   * Default is 2
   */
  minLength?: number

  /**
   * Normally, the tooltip will be the text. Do you want to add something extra?
   */
  extraTooltip?: ReactNode

  /**
   * Normally, the tooltip will be the text. Do you want to replace it with something else?
   */
  tooltipOverride?: ReactNode

  /**
   * De we want extra debug output about the sizing process?
   */
  debugMode?: boolean
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
  idPrefix = 'adaptive-trimmer',
  text = '',
  strategy = 'end',
  extraTooltip,
  tooltipOverride,
  minLength,
  debugMode,
}) => {
  // console.log('Text', text)
  return (
    <AdaptiveDynamicTrimmer
      idPrefix={idPrefix}
      getFullContent={() => ({ content: text, length: text.length })}
      getShortenedContent={wantedLength => {
        if (wantedLength >= text.length) {
          return {
            content: text,
            length: text.length,
          }
        }
        const content =
          strategy === 'middle'
            ? trimLongString(text, Math.floor(wantedLength / 2), Math.ceil(wantedLength / 2) - 1)!
            : trimLongString(text, wantedLength, 0)!
        const length = content.length
        return { content, length }
      }}
      minLength={minLength}
      tooltipOverride={tooltipOverride}
      extraTooltip={extraTooltip}
      debugMode={debugMode}
    />
  )
}
