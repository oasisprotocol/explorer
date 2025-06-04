import { FC, ReactNode } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { HighlightedText, HighlightOptions, HighlightPattern } from './index'
import { AdaptiveDynamicTrimmer } from '../AdaptiveTrimmer/AdaptiveDynamicTrimmer'
import { HighlightedTrimmedText } from './HighlightedTrimmedText'

type AdaptiveHighlightedTextProps = {
  idPrefix?: string

  /**
   * The text to display
   */
  text: string | undefined

  /**
   * The pattern to search for (and highlight)
   */
  pattern?: HighlightPattern

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
  pattern,
  options,
  extraTooltip,
  minLength,
  debugMode,
}) => {
  const fullContent = <HighlightedText text={text} pattern={pattern} options={options} />

  return text ? (
    <AdaptiveDynamicTrimmer
      idPrefix={idPrefix}
      getFullContent={() => ({
        content: fullContent,
        length: text.length,
      })}
      getShortenedContent={wantedLength => {
        const content = (
          <HighlightedTrimmedText
            fragmentLength={wantedLength}
            text={text}
            pattern={pattern}
            options={options}
          />
        )
        return {
          content,
          length: wantedLength,
        }
      }}
      extraTooltip={
        extraTooltip ? (
          <>
            <InfoIcon />
            {extraTooltip}
          </>
        ) : undefined
      }
      debugMode={debugMode}
      minLength={minLength}
    />
  ) : undefined
}
