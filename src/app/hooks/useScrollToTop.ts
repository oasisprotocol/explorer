import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export const useScrollToTop = ({ ignorePaths = [] }: { ignorePaths: RegExp[] }) => {
  const { pathname } = useLocation()

  useEffect(() => {
    const canControlScrollRestoration = 'scrollRestoration' in window.history
    if (canControlScrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }

    if (ignorePaths.some((path: RegExp) => path.test(pathname))) {
      return
    }

    window.scrollTo(0, 0)
  }, [ignorePaths, pathname])
}
