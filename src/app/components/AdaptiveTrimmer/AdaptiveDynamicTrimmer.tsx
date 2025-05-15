import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'

// We are going to use this string as a test string to see if the available area is limited (as it should be)
const testString = 'a'.repeat(1000)

type AdaptiveDynamicTrimmerProps = {
  getFullContent: () => {
    content: ReactNode
    length: number
  }
  getShortenedContent: (wantedLength: number) => ReactNode

  /**
   * Normally, the tooltip will be the full content. Do you want to add something?
   */
  extraTooltip: ReactNode

  /**
   * Normally, the tooltip will be the full content. Do you want to replace it with something else?
   */
  tooltipOverride?: ReactNode
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
}) => {
  // Initial setup
  const textRef = useRef<HTMLDivElement | null>(null)
  const { content: fullContent, length: fullLength } = getFullContent()

  // Data about the currently rendered version
  const [currentContent, setCurrentContent] = useState<ReactNode>()
  const [currentLength, setCurrentLength] = useState(0)

  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'verified' | 'failed'>(
    'none',
  )

  // Known good - this fits
  const [largestKnownGood, setLargestKnownGood] = useState(0)

  // Known bad - this doesn't fit
  const [smallestKnownBad, setSmallestKnownBad] = useState(fullLength + 1)

  // Are we exploring our possibilities now?
  const [inDiscovery, setInDiscovery] = useState(false)

  const attemptContent = useCallback((content: ReactNode, length: number) => {
    setCurrentContent(content)
    setCurrentLength(length)
  }, [])

  const attemptShortenedContent = useCallback(
    (length: number) => {
      const content = getShortenedContent(length)

      attemptContent(content, length)
    },
    [attemptContent, getShortenedContent],
  )

  // Verification is the process when we verify that the component is mounted in such a way
  // that the width is actually limited. (The whole thing won't work otherwise.)
  const initVerification = useCallback(() => {
    setVerificationStatus('pending')
    attemptContent(testString, testString.length)
  }, [setVerificationStatus, attemptContent])

  useEffect(() => {
    initVerification()
  }, [initVerification])

  // Discovery is the process of finding the largest possible part of the text
  // that still fits within the available width
  const initDiscovery = useCallback(() => {
    if (verificationStatus !== 'verified') return
    setLargestKnownGood(0)
    setSmallestKnownBad(fullLength + 1)
    attemptContent(fullContent, fullLength)
    setInDiscovery(true)
  }, [fullContent, fullLength, attemptContent, verificationStatus])

  useEffect(() => {
    initDiscovery()
    const handleResize = () => {
      initDiscovery()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initDiscovery])

  useEffect(() => {
    const isOverflow = !!textRef.current && textRef.current.scrollWidth > textRef.current.clientWidth

    switch (verificationStatus) {
      case 'none':
      case 'failed':
        break
      case 'pending':
        if (!textRef.current) {
          return
        }

        if (!isOverflow) {
          console.warn(
            'Adaptive dynamic trimmer: component not configured properly! Please make sure that the width is fixed (i. e. max-width=...), and overflow-x is hidden.',
          )
          // console.log('Problem with displaying', fullContent, verificationStatus, currentLength, fullLength)
          if (currentLength !== fullLength) {
            attemptContent(fullContent, fullLength)
            setVerificationStatus('failed')
          }
        } else {
          setVerificationStatus('verified')
        }
        break
      case 'verified':
        if (inDiscovery) {
          if (!textRef.current) {
            return
          }

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
    }
  }, [
    verificationStatus,
    attemptContent,
    attemptShortenedContent,
    currentLength,
    fullContent,
    fullLength,
    inDiscovery,
    initDiscovery,
    largestKnownGood,
    smallestKnownBad,
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
        ...(verificationStatus === 'failed' ? { border: '4px solid pink' } : {}),
      }}
    >
      <MaybeWithTooltip title={title} spanSx={{ whiteSpace: 'nowrap' }}>
        {currentContent}
      </MaybeWithTooltip>
    </Box>
  )
}
