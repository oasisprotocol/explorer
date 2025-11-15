import { useState, useLayoutEffect } from 'react'

// Sync with Shadcn/Oasis UI Library breakpoints
const BREAKPOINTS = {
  md: 768,
  lg: 1024,
  xl: 1280,
}

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
  })

  useLayoutEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`).matches
      const isTablet = window.matchMedia(`(max-width: ${BREAKPOINTS.lg - 1}px)`).matches
      const isLaptop = window.matchMedia(`(max-width: ${BREAKPOINTS.xl - 1}px)`).matches
      const isDesktop = window.matchMedia(`(min-width: ${BREAKPOINTS.xl}px)`).matches

      setScreenSize({
        isMobile,
        isTablet,
        isLaptop,
        isDesktop,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenSize
}
