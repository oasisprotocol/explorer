import { FC, PropsWithChildren, useCallback, useLayoutEffect, useState } from 'react'
import {
  AdaptiveTrimmerContext,
  AdaptiveTrimmerContextData,
  AdjustmentProcess,
  ControlSignals,
} from './index'

const controllerDebugMode = false

const debugLog = (message: any, ...args: any[]) => {
  if (controllerDebugMode) console.log(`[controller]`, message, ...args)
}

/**
 * This object provides control over the adaptive trimming process between all the components using it.
 * Should be injected into the context.
 */
export const AdaptiveTrimmerContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [instances, setInstances] = useState<string[]>([])

  const [shouldMinimize, setShouldMinimize] = useState(false)
  const [shouldAdjust, setShouldAdjust] = useState(false)
  const [adjustedList, setAdjustedList] = useState<string[]>([])
  const [currentlyAdjusting, setCurrentlyAdjusting] = useState<string>()
  const [minimizedList, setMinimizedList] = useState<string[]>([])
  const [hasMissedAction, setHasMissedAction] = useState(false)
  const [knownWindowWidth, setKnownWindowWidth] = useState(0)
  const [newWindowWidth, setNewWindowWidth] = useState(0)

  // If there are no instances around, forget that we should minimize or adjust
  useLayoutEffect(() => {
    if (shouldMinimize && !instances.length) {
      setShouldMinimize(false)
    }
    if (shouldAdjust && !instances.length) {
      setShouldAdjust(false)
    }
  }, [shouldMinimize, shouldAdjust, instances.length])

  // Start the adjustment process
  const startProcess = useCallback(() => {
    setMinimizedList([])
    setShouldMinimize(true)
  }, [])

  // Add a window resize handler to track width
  useLayoutEffect(() => {
    const handleResize = (event: UIEvent) => setNewWindowWidth((event.target as Window).innerWidth)
    setNewWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // React to window width changes
  useLayoutEffect(() => {
    if (!instances.length || shouldMinimize) return
    if (newWindowWidth === knownWindowWidth) return
    setKnownWindowWidth(newWindowWidth)
    if (shouldAdjust) {
      // We are inside an adjustment cycle, so we need to wait
      setHasMissedAction(true)
    } else {
      startProcess()
    }
  }, [newWindowWidth, knownWindowWidth, shouldMinimize, shouldAdjust, instances.length, startProcess])

  useLayoutEffect(() => {
    if (!shouldMinimize && !shouldAdjust && hasMissedAction) {
      // If we have missed out on some action, now is the time to make up for it
      setHasMissedAction(false)
      startProcess()
    }
  }, [shouldMinimize, shouldAdjust, hasMissedAction, startProcess])

  const reportProcessFinish = useCallback((id: string, process: AdjustmentProcess) => {
    // debugLog(id, 'has finished to', process)
    switch (process) {
      case 'minimize':
        setMinimizedList(list => (list.includes(id) ? list : [...list, id]))
        break
      case 'adjusting':
        setAdjustedList(list => [...list, id])
        break
      default:
        console.warn("Don't know how to handle this.")
    }
  }, [])

  // If we somehow end up dropping the currently adjusted component, make sure to mark it
  useLayoutEffect(() => {
    if (shouldAdjust && !!currentlyAdjusting && !minimizedList.includes(currentlyAdjusting)) {
      debugLog(`Ooops, the component that we were adjusting ${currentlyAdjusting} has disappeared.`)
      setCurrentlyAdjusting(undefined)
    }
  }, [shouldAdjust, currentlyAdjusting, minimizedList])

  // Select the next instance to adjust
  useLayoutEffect(() => {
    if (!shouldAdjust) return
    debugLog('Previously adjusting:', currentlyAdjusting)
    debugLog('Existing instances:', minimizedList, 'Already adjusted:', adjustedList)
    const nextAdjustment = minimizedList.find(id => !adjustedList.includes(id))
    if (nextAdjustment) {
      debugLog(`Now we will adjust "${nextAdjustment}"`)
      setCurrentlyAdjusting(nextAdjustment)
    } else {
      debugLog('Nothing more to adjust, we are done with the whole page.')
      setShouldAdjust(false)
      setCurrentlyAdjusting(undefined)
      setMinimizedList([])
      setAdjustedList([])
      return
    }
  }, [shouldAdjust, minimizedList, adjustedList, currentlyAdjusting])

  // When we ara done minimizing, start the size discovery process
  useLayoutEffect(() => {
    if (shouldMinimize && minimizedList.length === instances.length) {
      setShouldMinimize(false)
      if (instances.length) {
        debugLog(
          'Everyone has minimized, we will do the adjustments now on',
          minimizedList.length,
          'instances:',
          minimizedList,
        )
        setAdjustedList([])
        setCurrentlyAdjusting(undefined)
        setShouldAdjust(true)
      } else {
        debugLog('Finished minimizing, but there is nothing to adjust, so we are good')
      }
    }
  }, [shouldMinimize, minimizedList, instances])

  const onMount = useCallback((id: string) => {
    setInstances(instances => (instances.includes(id) ? instances : [...instances, id]))
    setHasMissedAction(true)
  }, [])

  const onUnmount = useCallback((id: string) => {
    setInstances(instances => instances.filter(instance => instance !== id))
    setMinimizedList(instances => instances.filter(instance => instance !== id))
    setAdjustedList(instances => instances.filter(instance => instance !== id))
  }, [])

  const useController = useCallback(
    (id: string): ControlSignals => {
      return {
        onMount,
        onUnmount,
        shouldMinimize: shouldMinimize && !minimizedList.includes(id),
        shouldAdjust: shouldAdjust && currentlyAdjusting === id,
        reportProcessFinish: process => reportProcessFinish(id, process),
      }
    },
    [
      onMount,
      onUnmount,
      minimizedList,
      reportProcessFinish,
      shouldMinimize,
      currentlyAdjusting,
      shouldAdjust,
    ],
  )

  const adaptiveState: AdaptiveTrimmerContextData = {
    useController,
  }

  return <AdaptiveTrimmerContext.Provider value={adaptiveState}>{children}</AdaptiveTrimmerContext.Provider>
}
