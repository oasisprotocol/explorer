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
  const [adjustIndex, setAdjustIndex] = useState(0)
  const [minimizedList, setMinimizedList] = useState<string[]>([])
  const [hasMissedAction, setHasMissedAction] = useState(false)

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

  // Add a window resize handler
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!instances.length || shouldMinimize) return
      if (shouldAdjust) {
        // We are inside an adjustment cycle, so we need to wait
        setHasMissedAction(true)
      } else {
        startProcess()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [shouldMinimize, shouldAdjust, instances.length, startProcess])

  useLayoutEffect(() => {
    if (!shouldMinimize && !shouldAdjust && hasMissedAction) {
      // If we have missed out on some action, now is the time to make up for it
      setHasMissedAction(false)
      startProcess()
    }
  }, [shouldMinimize, shouldAdjust, hasMissedAction, startProcess])

  const reportProcessFinish = useCallback(
    (id: string, process: AdjustmentProcess) => {
      // debugLog(id, 'has finished to', process)
      switch (process) {
        case 'minimize':
          setMinimizedList(list => (list.includes(id) ? list : [...list, id]))
          break
        case 'adjusting':
          if (adjustIndex + 1 === minimizedList.length) {
            debugLog('This was last one, we are all good')
            setShouldAdjust(false)
            setMinimizedList([])
          } else {
            debugLog('Now we will adjust', minimizedList[adjustIndex + 1])
            setAdjustIndex(index => index + 1)
          }
          break
        default:
          console.warn("Don't know how to handle this.")
      }
    },
    [minimizedList, adjustIndex],
  )

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
        setAdjustIndex(0)
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
  }, [])

  const useController = useCallback(
    (id: string): ControlSignals => {
      return {
        onMount: () => onMount(id),
        onUnmount: () => onUnmount(id),
        shouldMinimize: shouldMinimize && !minimizedList.includes(id),
        shouldAdjust: shouldAdjust && minimizedList[adjustIndex] === id,
        reportProcessFinish: process => reportProcessFinish(id, process),
      }
    },
    [onMount, onUnmount, minimizedList, reportProcessFinish, shouldMinimize, adjustIndex, shouldAdjust],
  )

  const adaptiveState: AdaptiveTrimmerContextData = {
    useController,
  }

  return <AdaptiveTrimmerContext.Provider value={adaptiveState}>{children}</AdaptiveTrimmerContext.Provider>
}
