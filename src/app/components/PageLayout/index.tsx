import { FC, PropsWithChildren, ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { useScreenSize } from '../../hooks/useScreensize'
import { BuildBanner } from '../BuildBanner'
import { useScopeParam } from '../../hooks/useScopeParam'
import { NetworkOfflineBanner, RuntimeOfflineBanner, ConsensusOfflineBanner } from '../OfflineBanner'
import { Search } from '../Search'
import { useIsApiReachable } from '../OfflineBanner/hook'
import useTheme from '@mui/material/styles/useTheme'

interface PageLayoutProps {
  mobileFooterAction?: ReactNode
}

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, mobileFooterAction }) => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()
  const scope = useScopeParam()
  const isApiReachable = useIsApiReachable(scope?.network ?? 'mainnet').reachable

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner />
      {scope && scope.layer !== 'consensus' && <RuntimeOfflineBanner />}
      {scope && scope.layer === 'consensus' && <ConsensusOfflineBanner />}
      <div className="min-h-screen">
        <Header />
        <div
          className="border-8 md:border-[15px] border-transparent px-0 md:px-[4%] pt-4 md:pt-6 border-t-0"
          style={{
            borderColor: theme.palette.layout.border,
          }}
        >
          {!isMobile && (
            <div className="mb-6">
              <Search scope={scope} disabled={!isApiReachable} />
            </div>
          )}
          <main className="min-h-[75vh]">{children}</main>
          <Footer scope={scope} mobileSearchAction={mobileFooterAction} />
        </div>
      </div>
    </>
  )
}
