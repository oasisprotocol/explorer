import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export const useScreenSize = () => {
  const theme = useTheme()
  return {
    isMobile: useMediaQuery(theme.breakpoints.down('sm')),
    isTablet: useMediaQuery(theme.breakpoints.down('md')),
    isLaptop: useMediaQuery(theme.breakpoints.down('lg')),
    isDesktop: useMediaQuery(theme.breakpoints.up('lg')),
  }
}
