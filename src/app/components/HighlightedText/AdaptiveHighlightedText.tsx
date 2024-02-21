import { FC, ReactNode } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { HighlightedText, HighlightOptions } from './index'
import { AdaptiveDynamicTrimmer } from '../AdaptiveTrimmer/AdaptiveDynamicTrimmer'
import { HighlightedTrimmedText } from './HighlightedTrimmedText'

type AdaptiveHighlightedTextProps = {
  /**
   * The text to display
   */
  text: string | undefined

  /**
   * The pattern to search for (and highlight)
   */
  pattern: string | undefined

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
}

/**
 * Display a text with a part highlighted, adaptively trimmed to the maximum length around the highlight
 */
export const AdaptiveHighlightedText: FC<AdaptiveHighlightedTextProps> = ({
  text,
  pattern,
  options,
  extraTooltip,
}) => {
  const fullContent = <HighlightedText text={text} pattern={pattern} options={options} />

  return text ? (
    <AdaptiveDynamicTrimmer
      getFullContent={() => ({
        content: fullContent,
        length: text.length,
      })}
      getShortenedContent={wantedLength => (
        <HighlightedTrimmedText
          fragmentLength={wantedLength}
          text={text}
          pattern={pattern}
          options={options}
        />
      )}
      extraTooltip={
        extraTooltip ? (
          <>
            <InfoIcon />
            {extraTooltip}
          </>
        ) : undefined
      }
    />
  ) : undefined
}
