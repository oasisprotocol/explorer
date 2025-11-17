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
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined
    }

    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`)
    const tabletQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.lg - 1}px)`)
    const laptopQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.xl - 1}px)`)
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.xl}px)`)

    const updateScreenSize = () => {
      setScreenSize({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isLaptop: laptopQuery.matches,
        isDesktop: desktopQuery.matches,
      })
    }

    updateScreenSize()

    mobileQuery.addEventListener('change', updateScreenSize)
    tabletQuery.addEventListener('change', updateScreenSize)
    laptopQuery.addEventListener('change', updateScreenSize)
    desktopQuery.addEventListener('change', updateScreenSize)

    return () => {
      mobileQuery.removeEventListener('change', updateScreenSize)
      tabletQuery.removeEventListener('change', updateScreenSize)
      laptopQuery.removeEventListener('change', updateScreenSize)
      desktopQuery.removeEventListener('change', updateScreenSize)
    }
  }, [])

  return screenSize
}
