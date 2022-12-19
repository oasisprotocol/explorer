import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export function PageLayout({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ pt: 5, px: isMobile ? 0 : '5%' }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </Box>
  )
}
