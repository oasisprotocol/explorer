import { useEffect, useState } from 'react'

export const useWindowScroll = (): number => {
  const [windowScrollY, setWindowScrollY] = useState(0)

  useEffect(() => {
    const windowScrollListener = () => {
      setWindowScrollY(window.scrollY)
    }

    window.addEventListener('scroll', windowScrollListener)

    return () => window.removeEventListener('scroll', windowScrollListener)
  }, [])

  return windowScrollY
}
