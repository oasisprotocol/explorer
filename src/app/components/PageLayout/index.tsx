import { FC, PropsWithChildren, ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled, useTheme } from '@mui/material/styles'
import { BuildBanner } from '../BuildBanner'
import { useScopeParam } from '../../hooks/useScopeParam'
import { NetworkOfflineBanner, RuntimeOfflineBanner, ConsensusOfflineBanner } from '../OfflineBanner'
import { Search } from '../Search'
import { useIsApiReachable } from '../OfflineBanner/hook'
import { Network } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'

interface PageLayoutProps {
  mobileFooterAction?: ReactNode
}

export const StyledMain = styled('main')({
  minHeight: '75vh',
})

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, mobileFooterAction }) => {
  const theme = useTheme()
  const { isMobile, isTablet } = useScreenSize()
  const scope = useScopeParam()
  const isApiReachable = useIsApiReachable(scope?.network || Network.mainnet).reachable

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner />
      {scope && scope.layer !== Layer.consensus && <RuntimeOfflineBanner />}
      {scope && scope.layer === Layer.consensus && <ConsensusOfflineBanner />}
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
              <Search scope={scope} variant={isTablet ? 'icon' : 'button'} disabled={!isApiReachable} />
            </Box>
          )}
          <StyledMain>{children}</StyledMain>
          <Footer scope={scope} mobileSearchAction={mobileFooterAction} />
        </Box>
      </Box>
    </>
  )
}
