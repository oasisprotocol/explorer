import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info'
import { trimLongString } from '../../utils/trimLongString'
import { MaybeWithTooltip } from './MaybeWithTooltip'

type AdaptiveTrimmerProps = {
  text: string | undefined
  strategy: 'middle' | 'end'
  extraTooltip?: ReactNode
}

/**
 * Display content, potentially shortened as needed.
 *
 * This component will do automatic detection of available space,
 * and determine the best way to display content accordingly.
 */
export const AdaptiveTrimmer: FC<AdaptiveTrimmerProps> = ({ text = '', strategy = 'end', extraTooltip }) => {
  // Initial setup
  const fullLength = text.length
  const textRef = useRef<HTMLDivElement | null>(null)

  // Data about the currently rendered version
  const [currentContent, setCurrentContent] = useState('')
  const [currentLength, setCurrentLength] = useState(0)

  // Known good - this fits
  const [largestKnownGood, setLargestKnownGood] = useState(0)

  // Known bad - this doesn't fit
  const [smallestKnownBad, setSmallestKnownBad] = useState(fullLength + 1)

  // Are we exploring our possibilities now?
  const [inDiscovery, setInDiscovery] = useState(false)

  const attemptContent = useCallback((content: string, length: number) => {
    setCurrentContent(content)
    setCurrentLength(length)
  }, [])

  const attemptShortenedContent = useCallback(
    (length: number) => {
      const content =
        strategy === 'middle'
          ? trimLongString(text, Math.floor(length / 2) - 1, Math.floor(length / 2) - 1)!
          : trimLongString(text, length, 0)!

      attemptContent(content, length)
    },
    [strategy, text, attemptContent],
  )

  const initDiscovery = useCallback(() => {
    setLargestKnownGood(0)
    setSmallestKnownBad(fullLength + 1)
    attemptContent(text, fullLength)
    setInDiscovery(true)
  }, [text, fullLength, attemptContent])

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
      const isOverflow = textRef.current.scrollWidth > textRef.current.clientWidth

      if (isOverflow) {
        // This is too much

        // Update known bad length
        const newSmallestKnownBad = Math.min(currentLength, smallestKnownBad)
        setSmallestKnownBad(newSmallestKnownBad)

        // We should try something smaller
        attemptShortenedContent(Math.floor((largestKnownGood + newSmallestKnownBad) / 2))
      } else {
        // This is OK

        // Update known good length
        const newLargestKnownGood = Math.max(currentLength, largestKnownGood)
        setLargestKnownGood(currentLength)

        if (currentLength === fullLength) {
          // The whole thing fits, so we are good.
          setInDiscovery(false)
        } else {
          if (currentLength + 1 === smallestKnownBad) {
            // This the best we can do, for now
            setInDiscovery(false)
          } else {
            // So far, so good, but we should try something longer
            attemptShortenedContent(Math.floor((newLargestKnownGood + smallestKnownBad) / 2))
          }
        }
      }
    }
  }, [inDiscovery, currentLength, largestKnownGood, smallestKnownBad, attemptShortenedContent, fullLength])

  if (!text) return null

  const title =
    currentLength !== fullLength ? (
      <Box>
        <Box>{text}</Box>
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
      }}
    >
      <MaybeWithTooltip title={title} spanSx={{ whiteSpace: 'nowrap' }}>
        {currentContent}
      </MaybeWithTooltip>
    </Box>
  )
}
