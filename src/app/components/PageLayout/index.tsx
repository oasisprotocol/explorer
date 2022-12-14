import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import Box from '@mui/material/Box'

export function PageLayout() {
  return (
    <Box sx={{ pt: 5, px: '5%' }}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </Box>
  )
}
