import { FC, PropsWithChildren, ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { BuildPreviewBanner } from '../BuildPreviewBanner'

interface PageLayoutProps {
  mobileFooterAction?: ReactNode
}

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, mobileFooterAction }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <BuildPreviewBanner />
      <Box
        sx={{
          pt: 4,
          px: isMobile ? 0 : '4%',
          border: isMobile ? 'none' : `solid 15px ${theme.palette.layout.border}`,
        }}
      >
        <Header />
        <main>{children}</main>
        <Footer mobileSearchAction={mobileFooterAction} />
      </Box>
    </>
  )
}
