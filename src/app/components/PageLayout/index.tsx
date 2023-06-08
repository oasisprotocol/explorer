import { FC, PropsWithChildren, ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import { BuildBanner } from '../BuildPreviewBanner'
import { useScopeParam } from '../../hooks/useScopeParam'
import { NetworkOfflineBanner, RuntimeOfflineBanner } from '../OfflineBanner'

interface PageLayoutProps {
  mobileFooterAction?: ReactNode
}

export const StyledMain = styled('main')({
  minHeight: '75vh',
})

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, mobileFooterAction }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const scope = useScopeParam()

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner />
      {scope && <RuntimeOfflineBanner />}
      <Box
        sx={{
          border: isMobile ? 'none' : `solid 15px ${theme.palette.layout.border}`,
          minHeight: '100vh',
        }}
      >
        <Header />
        <Box
          sx={{
            px: isMobile ? 0 : '4%',
          }}
        >
          <StyledMain>{children}</StyledMain>
          <Footer scope={scope} mobileSearchAction={mobileFooterAction} />
        </Box>
      </Box>
    </>
  )
}
