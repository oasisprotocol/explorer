import { FC, PropsWithChildren, ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled, useTheme } from '@mui/material/styles'
import { BuildBanner } from '../BuildBanner'
import { useScopeParam } from '../../hooks/useScopeParam'
import { NetworkOfflineBanner, RuntimeOfflineBanner } from '../OfflineBanner'
import { Search } from '../Search'
import { useIsApiOffline } from '../OfflineBanner/hook'
import { Network } from '../../../types/network'

interface PageLayoutProps {
  mobileFooterAction?: ReactNode
}

export const StyledMain = styled('main')({
  minHeight: '75vh',
})

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, mobileFooterAction }) => {
  const theme = useTheme()
  const { isMobile, isDesktop } = useScreenSize()
  const scope = useScopeParam()
  const isApiOffline = useIsApiOffline(scope?.network || Network.mainnet)

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner />
      {scope && <RuntimeOfflineBanner />}
      <Box
        sx={{
          minHeight: '100vh',
        }}
      >
        <Header />
        <Box
          sx={{
            border: isMobile ? 'none' : `solid 15px ${theme.palette.layout.border}`,
            borderTop: 0,
            px: isMobile ? 0 : '4%',
            pt: isMobile ? 4 : 6,
          }}
        >
          {!isMobile && (
            <Box
              sx={{
                mb: 6,
              }}
            >
              <Search scope={scope} variant={isDesktop ? 'button' : 'icon'} disabled={isApiOffline} />
            </Box>
          )}
          <StyledMain>{children}</StyledMain>
          <Footer scope={scope} mobileSearchAction={mobileFooterAction} />
        </Box>
      </Box>
    </>
  )
}
