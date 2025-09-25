import { FC, ReactNode, useMemo } from 'react'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { getAdaptiveId, ShorteningResult, useAdaptiveSizing } from './hooks'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type AdaptiveDynamicTrimmerProps = {
  /**
   * The ID (prefix) used for debugging
   */
  idPrefix?: string

  /**
   * A function to return the full content
   */
  getFullContent: () => {
    content: ReactNode
    length: number
  }

  /**
   * A function to return shortened content
   */
  getShortenedContent: (wantedLength: number) => ShorteningResult

  /**
   * The minimum length we ever want to shorten to.
   *
   * Default is 2
   */
  minLength?: number

  /**
   * Normally, the tooltip will be the full content. Do you want to add something?
   */
  extraTooltip: ReactNode

  /**
   * Normally, the tooltip will be the full content. Do you want to replace it with something else?
   */
  tooltipOverride?: ReactNode

  /**
   * Do we want to see debug output about the adaptive trimming process?
   */
  debugMode?: boolean
}

/**
 * Display content, potentially shortened as needed.
 *
 * This component will do automatic detection of available space,
 * and determine the best way to display content accordingly.
 *
 * The difference compared to AdaptiveTrimmer is that this component
 * expects a function to provide a shortened version of the components.
 */
export const AdaptiveDynamicTrimmer: FC<AdaptiveDynamicTrimmerProps> = ({
  idPrefix = 'adaptive-dynamic-trimmer',
  getFullContent,
  getShortenedContent,
  extraTooltip,
  tooltipOverride,
  debugMode = false,
  minLength = 2,
}) => {
  const id = useMemo(() => getAdaptiveId(idPrefix), [idPrefix])

  const { currentContent, fullContent, textRef, isTruncated, isFinal } = useAdaptiveSizing(
    id,
    getFullContent,
    getShortenedContent,
    debugMode,
    minLength,
  )

  const title = isTruncated ? (
    <Box>
      <Box>{tooltipOverride ?? fullContent}</Box>
      {extraTooltip && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <InfoIcon />
          {extraTooltip}
        </Box>
      )}
    </Box>
  ) : (
    extraTooltip
  )

  return (
    <Box component="span" ref={textRef} sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <MaybeWithTooltip
        title={title}
        spanClassName={cn('whitespace-nowrap', isFinal ? 'opacity-100' : 'opacity-0')}
      >
        {currentContent}
      </MaybeWithTooltip>
    </Box>
  )
}
