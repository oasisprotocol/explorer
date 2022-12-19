import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { AppBox } from '../AppBox/AppBox'

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <AppBox sx={{ pt: 5, px: '5%' }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </AppBox>
  )
}
