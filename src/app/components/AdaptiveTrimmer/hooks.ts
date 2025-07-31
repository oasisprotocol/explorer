import {
  MutableRefObject,
  ReactNode,
  useCallback,
  // using useLayoutEffect would be nicer (it eliminated the flickers), but sometimes we run unto the limit of maximum updates during render.
  // until this is resolved, we need to stick to useEffect instead
  // useLayoutEffect,
  useEffect as useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useAdaptiveTrimmerContext } from '../AdaptiveTrimmerContext'

const emptyTestContent = '.^.'

export type ShorteningResult = {
  content: ReactNode
  length: number
}

interface AdaptiveSizingControls {
  fullContent: ReactNode
  currentContent: ReactNode
  textRef: MutableRefObject<HTMLDivElement | null>
  isTruncated: boolean
  isFinal: boolean
}

let idCounter = 0

export const getAdaptiveId = (prefix: string) => `${prefix}-${++idCounter}`

// Hook for implementing the adaptive sizing behavior
export const useAdaptiveSizing = (
  id: string,
  getFullContent: () => ShorteningResult,
  getShortenedContent: (wantedLength: number) => ShorteningResult,
  debugMode = false,
  minLength = 2,
): AdaptiveSizingControls => {
  const { useController } = useAdaptiveTrimmerContext()

  const { shouldMinimize, shouldAdjust, reportProcessFinish, onMount, onUnmount } = useController(id)

  // Register and de-register this instance (the controller needs to know who is here)
  useLayoutEffect(() => {
    onMount(id)
    return () => onUnmount(id)
  }, [id, onMount, onUnmount])

  const debugLog = useCallback(
    (message: any, ...args: any[]) => {
      if (debugMode) console.log(`[${id}]`, message, ...args)
    },
    [debugMode, id],
  )

  const { content: fullContent, length: fullLength } = getFullContent()

  // Are we currently minimizing out content?
  const [isMinimizing, setIsMinimizing] = useState(false)

  // Where are we in the adjustment process?
  const [adjustmentStep, setAdjustmentStep] = useState<
    'idle' | 'checkBaseline' | 'checkFull' | 'findBest' | 'done'
  >('idle')

  const [currentContent, setCurrentContent] = useState<ReactNode>()
  const [currentLength, setCurrentLength] = useState(0)

  // Known good - this fits
  const [largestKnownGood, setLargestKnownGood] = useState(0)

  // Known bad - this doesn't fit
  const [smallestKnownBad, setSmallestKnownBad] = useState(fullLength + 1)

  // Ref to attach to DOM element
  const textRef = useRef<HTMLDivElement | null>(null)

  // The first element where we are supposed to fine overflow anyway
  const [overflowRoot, setOverflowRoot] = useState<HTMLElement | null>()

  type OverflowStatus = {
    isOverflow: boolean
    element: HTMLElement | null
    steps: number
  }

  // A function to find the first overflow in our ancestors
  const checkOverflow = useCallback((): OverflowStatus => {
    let element: HTMLElement | null = textRef.current
    let steps = 0
    let isOverflow = false

    while (element && !isOverflow) {
      if (element.scrollWidth > element.offsetWidth) {
        isOverflow = true
      } else {
        element = element.parentElement
        steps++
      }
    }
    return { isOverflow, element, steps }
  }, [textRef])

  const checkIfOverflow = useCallback((): boolean => {
    const {
      isOverflow,
      element,
      // steps
    } = checkOverflow()
    // No overflow whatsoever, clear case
    if (!isOverflow) return false

    // We should not be having an overflow, so this is bad
    if (!overflowRoot) return true

    // We need to check if this is the same as baseline
    return element !== overflowRoot
  }, [checkOverflow, overflowRoot])

  // Function to update context and wait for the results
  const attemptContent = useCallback(
    (content: ReactNode, length: number) => {
      setCurrentContent(content)
      setCurrentLength(length)
    },
    [setCurrentContent, setCurrentLength],
  )

  // Use a shortened form for content
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

  // Start to minimise on signal from controller
  useLayoutEffect(() => {
    if (shouldMinimize && !isMinimizing) setIsMinimizing(true)
  }, [id, shouldMinimize, isMinimizing])

  // Execute actual minimization
  useLayoutEffect(() => {
    if (isMinimizing) {
      if (currentContent !== emptyTestContent) {
        // phase 1: set content
        attemptContent(emptyTestContent, emptyTestContent.length)
      } else {
        // phase 2: proceed to next step
        // debugLog(`I wonder if layout has updated yet. scrollWidth is now ${textRef.current?.scrollWidth}`)
        setIsMinimizing(false)
        reportProcessFinish('minimize')
      }
    }
  }, [isMinimizing, attemptContent, currentContent, debugLog, id, reportProcessFinish])

  // Execute the next phase of adjustment
  useLayoutEffect(() => {
    if (!shouldAdjust) return
    debugLog(`Step "${adjustmentStep}"`)
    let overflowStatus: OverflowStatus
    let isOverflow: boolean
    switch (adjustmentStep) {
      case 'idle':
        // We are just starting
        setAdjustmentStep('checkBaseline')
        break
      case 'checkBaseline':
        // We need to record the baseline
        overflowStatus = checkOverflow()

        if (overflowStatus.isOverflow) {
          debugLog(
            'At baseline test, found overflow at step',
            overflowStatus.steps,
            ':',
            overflowStatus.element,
            overflowStatus.element!.scrollWidth,
            overflowStatus.element!.clientWidth,
          )
          setOverflowRoot(overflowStatus.element)
        } else {
          debugLog('At baseline test, found no overflow around', textRef.current)
          setOverflowRoot(undefined)
        }
        setAdjustmentStep('checkFull')
        break
      case 'checkFull':
        // Check if we can fit in the whole content
        if (currentLength !== fullLength) {
          // phase 1: set full content
          attemptContent(fullContent, fullLength)
        } else {
          // phase 2: evaluate
          isOverflow = checkIfOverflow()
          if (isOverflow) {
            debugLog("Full content doesn't fit, we need to try to find something smaller")
            setLargestKnownGood(0)
            setSmallestKnownBad(fullLength + 1)
            setAdjustmentStep('findBest')
          } else {
            debugLog('Full content fits')
            setAdjustmentStep('done')
          }
        }
        break
      case 'findBest':
        // Iterate until we find the best
        isOverflow = checkIfOverflow()
        if (isOverflow) {
          // This is too much

          // Update known bad length
          const newSmallestKnownBad = Math.min(currentLength, smallestKnownBad)
          setSmallestKnownBad(newSmallestKnownBad)

          // Have we hit the minimum?
          if (currentLength === minLength) {
            // If we can not even fit the minimum number, there is nothing we can do here.
            debugLog('Sticking to the minimum of', minLength)
            setAdjustmentStep('done')
          } else if (currentLength === largestKnownGood + 1) {
            // This the best we can do, for now
            debugLog(largestKnownGood, 'is as long as we can grow.')
            attemptShortenedContent(largestKnownGood)
            setAdjustmentStep('done')
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

          if (currentLength === smallestKnownBad) {
            // Note: normally, when there is no overflow,
            // currentLength should always be lower than smallestKnownBad.
            // However, once in a while, it's possible that it will be
            // the same value, which means that because of some race
            // condition during rendering, at one time,
            // we had an overflow at this length, but now we don't.
            // In that case, let's just stop here.
            debugLog('Anomalous results at', currentLength, '. Stopping.')
            setAdjustmentStep('done')
          } else if (currentLength + 1 === smallestKnownBad) {
            // This the best we can do, for now.
            // One more character would be too much.
            debugLog(currentLength, 'is as long as we can grow.')
            setAdjustmentStep('done')
          } else {
            // So far, so good, but we should try something longer
            debugLog(`${newLargestKnownGood} <= ? < ${smallestKnownBad}, going UP from ${currentLength}`)
            attemptShortenedContent(Math.floor((newLargestKnownGood + smallestKnownBad) / 2))
          }
        }
        break
      case 'done':
        reportProcessFinish('adjusting')
        setAdjustmentStep('idle')
        break
      default:
        console.warn('Unknown process step', adjustmentStep)
    }
  }, [
    shouldAdjust,
    adjustmentStep,
    checkOverflow,
    debugLog,
    attemptContent,
    attemptShortenedContent,
    checkIfOverflow,
    currentLength,
    fullLength,
    fullContent,
    largestKnownGood,
    smallestKnownBad,
    minLength,
    reportProcessFinish,
  ])

  return {
    fullContent,
    currentContent,
    textRef,
    isTruncated: currentLength !== fullLength,
    isFinal: currentContent !== emptyTestContent && !shouldAdjust,
  }
}
