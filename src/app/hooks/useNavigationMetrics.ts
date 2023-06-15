import { MutableRefObject, useLayoutEffect, useRef } from 'react'

export const useNavigationMetrics: () => MutableRefObject<{
  reload: boolean
  backForward: boolean
  newPage: boolean
}> = () => {
  const pageMetrics = useRef({
    reload: false,
    backForward: false,
    newPage: false,
  })

  useLayoutEffect(() => {
    const performanceObserver = new PerformanceObserver(observedEntries => {
      const entryList: PerformanceNavigationTiming[] = observedEntries.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[]

      entryList.forEach(entry => {
        switch (entry.type) {
          case 'reload': {
            pageMetrics.current.reload = true
            return
          }
          case 'back_forward': {
            pageMetrics.current.backForward = true
            return
          }
          default: {
            pageMetrics.current.newPage = true
            return
          }
        }
      })
    })

    performanceObserver.observe({
      type: 'navigation',
      buffered: true,
    })
  }, [])

  return pageMetrics
}
