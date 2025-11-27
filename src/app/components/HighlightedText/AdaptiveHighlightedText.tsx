import { FC, ReactNode } from 'react'
import { Info } from 'lucide-react'
import { HighlightedText, HighlightOptions } from './index'
import { AdaptiveDynamicTrimmer } from '../AdaptiveTrimmer/AdaptiveDynamicTrimmer'
import { HighlightedTrimmedText } from './HighlightedTrimmedText'

type AdaptiveHighlightedTextProps = {
  idPrefix?: string

  /**
   * The text to display
   */
  text: string | undefined

  /**
   * Options for highlighting (case sensitivity, styling, etc.)
   *
   * (This is optional, sensible defaults are provided.)
   */
  options?: HighlightOptions

  /**
   * Extra content to put into the tooltip
   */
  extraTooltip?: ReactNode

  /**
   * The minimum length we never want to go under
   */
  minLength?: number

  /**
   * Do we want to see debug output about the adaptive trimming process?
   */
  debugMode?: boolean
}

/**
 * Display a text with a part highlighted, adaptively trimmed to the maximum length around the highlight
 */
export const AdaptiveHighlightedText: FC<AdaptiveHighlightedTextProps> = ({
  idPrefix = 'adaptive-highlighted-text',
  text,
  options,
  extraTooltip,
  minLength,
  debugMode,
}) => {
  const fullContent = <HighlightedText text={text} options={options} />

  return text ? (
    <AdaptiveDynamicTrimmer
      idPrefix={idPrefix}
      getFullContent={() => ({
        content: fullContent,
        length: text.length,
      })}
      getShortenedContent={wantedLength => {
        const content = <HighlightedTrimmedText fragmentLength={wantedLength} text={text} options={options} />
        return {
          content,
          length: wantedLength,
        }
      }}
      extraTooltip={
        extraTooltip ? (
          <>
            <Info size="18" className="stroke-zinc-500" />
            {extraTooltip}
          </>
        ) : undefined
      }
      debugMode={debugMode}
      minLength={minLength}
    />
  ) : undefined
}
