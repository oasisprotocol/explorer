import { useEffect } from 'react'

export const usePageHide = (
  callback: (event: PageTransitionEvent) => void,
  options?: EventListenerOptions,
) => {
  useEffect(() => {
    window.addEventListener('pagehide', callback, options)
    return () => {
      window.removeEventListener('pagehide', callback, options)
    }
  }, [callback, options])
}
