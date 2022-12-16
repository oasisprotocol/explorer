import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import Box from '@mui/material/Box'

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ pt: 5, px: '5%' }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </Box>
  )
}
