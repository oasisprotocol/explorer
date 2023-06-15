import { useLocation, useNavigation, UNSAFE_DataRouterContext as DataRouterContext } from 'react-router-dom'
import { useCallback, useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigationMetrics } from './useNavigationMetrics'
import { usePageHide } from './usePageHide'

export const SCROLL_RESTORATION_KEY = 'scroll_restoration'

let savedScrollPositions: Record<string, number> = {}

export const useScrollToTop = ({ ignorePaths = [] }: { ignorePaths: RegExp[] }) => {
  const dataRouterContext = useContext(DataRouterContext)
  const navigation = useNavigation()
  const canControlScrollRestoration = useRef(false)
  const navigationMetrics = useNavigationMetrics()
  const { reload, backForward, newPage } = navigationMetrics.current
  const { pathname } = useLocation()

  useEffect(() => {
    const scrollRestoration = 'scrollRestoration' in window.history
    if (scrollRestoration) {
      window.history.scrollRestoration = 'manual'
      canControlScrollRestoration.current = true
    }

    return () => {
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  usePageHide(
    useCallback(() => {
      if (navigation.state === 'idle') {
        savedScrollPositions[pathname] = window.scrollY
      }
      sessionStorage.setItem(SCROLL_RESTORATION_KEY, JSON.stringify(savedScrollPositions))
      window.history.scrollRestoration = 'auto'
    }, [navigation.state, pathname]),
  )

  useLayoutEffect(() => {
    try {
      const sessionPositions = sessionStorage.getItem(SCROLL_RESTORATION_KEY)
      if (sessionPositions) {
        savedScrollPositions = JSON.parse(sessionPositions)
      }
    } catch (e) {
      // Ignore error
    }
  }, [])

  // Enable scroll restoration in the router
  useLayoutEffect(() => {
    const disableScrollRestoration = dataRouterContext?.router?.enableScrollRestoration(
      savedScrollPositions,
      () => window.scrollY,
    )
    return () => disableScrollRestoration && disableScrollRestoration()
  }, [dataRouterContext?.router])

  useEffect(() => {
    if (!canControlScrollRestoration.current) {
      return
    }

    if (ignorePaths.some((path: RegExp) => path.test(pathname))) {
      return
    }

    const top = savedScrollPositions?.[pathname] ?? 0

    if (reload || backForward) {
      window.scrollTo({
        top,
        behavior: 'auto',
      })
      return
    } else if (newPage) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    navigationMetrics.current = {
      backForward: false,
      reload: false,
      newPage: false,
    }
  }, [ignorePaths, pathname, navigationMetrics, backForward, newPage, reload])
}
