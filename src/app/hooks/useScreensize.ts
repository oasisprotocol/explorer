import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export const useScreenSize = () => {
  const theme = useTheme()
  return {
    isMobile: useMediaQuery(theme.breakpoints.down('md')),
    isTablet: useMediaQuery(theme.breakpoints.down('lg')),
    isLaptop: useMediaQuery(theme.breakpoints.down('xl')),
    isDesktop: useMediaQuery(theme.breakpoints.up('xl')),
  }
}
