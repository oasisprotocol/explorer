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
import { useScrollToTop } from '../../hooks/useScrollToTop'

interface PageLayoutProps {
  mobileFooterAction?: ReactNode
}

export const StyledMain = styled('main')({
  minHeight: '75vh',
})

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, mobileFooterAction }) => {
  useScrollToTop({
    ignorePaths: [/#/],
  })

  const theme = useTheme()
  const { isMobile, isTablet } = useScreenSize()
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
          sx={
            isMobile
              ? {
                  border:
                    theme.palette.background.default !== theme.palette.layout.border
                      ? `solid 10px ${theme.palette.layout.border}`
                      : 'none',
                  borderTop: 0,
                  px: 0,
                  pt: 4,
                }
              : {
                  border: `solid 15px ${theme.palette.layout.border}`,
                  borderTop: 0,
                  px: '4%',
                  pt: 6,
                }
          }
        >
          {!isMobile && (
            <Box
              sx={{
                mb: 6,
              }}
            >
              <Search scope={scope} variant={isTablet ? 'icon' : 'button'} disabled={isApiOffline} />
            </Box>
          )}
          <StyledMain>{children}</StyledMain>
          <Footer scope={scope} mobileSearchAction={mobileFooterAction} />
        </Box>
      </Box>
    </>
  )
}
