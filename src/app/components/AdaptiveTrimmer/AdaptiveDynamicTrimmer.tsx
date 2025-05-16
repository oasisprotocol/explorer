import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'

type ShorteningResult = {
  content: ReactNode
  length: number
}

type AdaptiveDynamicTrimmerProps = {
  getFullContent: () => {
    content: ReactNode
    length: number
  }
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
   * Run in debug mode
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
  getFullContent,
  getShortenedContent,
  extraTooltip,
  tooltipOverride,
  debugMode = true,
  minLength = 2,
}) => {
  // Initial setup
  const textRef = useRef<HTMLDivElement | null>(null)
  const { content: fullContent, length: fullLength } = getFullContent()

  // Data about the currently rendered version
  const [currentContent, setCurrentContent] = useState<ReactNode>()
  const [currentLength, setCurrentLength] = useState(0)

  // Known good - this fits
  const [largestKnownGood, setLargestKnownGood] = useState(0)

  // Known bad - this doesn't fit
  const [smallestKnownBad, setSmallestKnownBad] = useState(fullLength + 1)

  // Are we exploring our possibilities now?
  const [inDiscovery, setInDiscovery] = useState(false)

  const debugLog = useCallback(
    (message: any, ...args: any[]) => {
      if (debugMode) console.log(message, ...args)
    },
    [debugMode],
  )

  const attemptContent = useCallback((content: ReactNode, length: number) => {
    setCurrentContent(content)
    setCurrentLength(length)
  }, [])

  const attemptShortenedContent = useCallback(
    (wantedLength: number) => {
      const { content, length } = getShortenedContent(wantedLength)
      if (length !== wantedLength) {
        debugLog(`Wanted to shorten content to ${wantedLength}, received ${length}.`)
      }
      attemptContent(content, length)
    },
    [attemptContent, getShortenedContent, debugLog],
  )

  const initDiscovery = useCallback(() => {
    setLargestKnownGood(0)
    setSmallestKnownBad(fullLength + 1)
    debugLog('Starting discovery. Attempting full content at length', fullLength)
    attemptContent(fullContent, fullLength)
    setInDiscovery(true)
  }, [fullContent, fullLength, attemptContent, debugLog])

  useEffect(() => {
    initDiscovery()
    const handleResize = () => {
      initDiscovery()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initDiscovery])

  useEffect(() => {
    if (inDiscovery) {
      if (!textRef.current) {
        return
      }
      let element: HTMLElement | null = textRef.current
      let isOverflow = false

      while (element) {
        isOverflow = isOverflow || element.scrollWidth > element.clientWidth
        element = element.parentElement
      }

      if (isOverflow) {
        // This is too much

        // Update known bad length
        const newSmallestKnownBad = Math.min(currentLength, smallestKnownBad)
        setSmallestKnownBad(newSmallestKnownBad)

        // Have we hit the minimum?
        if (currentLength === minLength) {
          // If we can not even fit the minimum number, there is nothing we can do here.
          debugLog('Sticking to the minimum of', minLength)
          setInDiscovery(false)
        } else {
          // We should try something smaller
          debugLog(`${largestKnownGood} <= ? < ${newSmallestKnownBad}, going DOWN from ${currentLength}`)
          attemptShortenedContent(
            Math.max(minLength, Math.floor((largestKnownGood + newSmallestKnownBad) / 2)),
          )
        }
      } else {
        // This is OK

        // Update known good length
        const newLargestKnownGood = Math.max(currentLength, largestKnownGood)
        setLargestKnownGood(currentLength)

        if (currentLength === fullLength) {
          // The whole thing fits, so we are good.
          debugLog('The whole thing fits, we are good')
          setInDiscovery(false)
        } else {
          if (currentLength + 1 === smallestKnownBad) {
            // This the best we can do, for now
            debugLog(currentLength, 'is as long as we can grow.')
            setInDiscovery(false)
          } else {
            // So far, so good, but we should try something longer
            debugLog(`${newLargestKnownGood} <= ? < ${smallestKnownBad}, going UP from ${currentLength}`)
            attemptShortenedContent(Math.floor((newLargestKnownGood + smallestKnownBad) / 2))
          }
        }
      }
    }
  }, [
    attemptShortenedContent,
    currentLength,
    fullContent,
    fullLength,
    inDiscovery,
    initDiscovery,
    largestKnownGood,
    smallestKnownBad,
    debugLog,
    minLength,
  ])

  const title =
    currentLength !== fullLength ? (
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
    <Box
      ref={textRef}
      sx={{
        overflow: 'hidden',
        maxWidth: '100%',
        textWrap: 'nowrap',
        opacity: inDiscovery ? 0 : 1,
      }}
    >
      <MaybeWithTooltip title={title} spanSx={{ whiteSpace: 'nowrap' }}>
        {currentContent}
      </MaybeWithTooltip>
    </Box>
  )
}
