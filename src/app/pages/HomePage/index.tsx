import { FC } from 'react'
import { Footer } from '../../components/PageLayout/Footer'
import { BuildBanner } from '../../components/BuildBanner'
import { useSearchQueryNetworkParam } from '../../hooks/useSearchQueryNetworkParam'
import { NetworkOfflineBanner } from '../../components/OfflineBanner'
import { Social } from '../../components/Social'
import { RecentBlocksCard } from './RecentBlocksCard'
import { Ecosystem } from './Ecosystem'
import { RoflAppsCard } from './RoflAppsCard'
import { HomeSearch } from './HomeSearch'
import { Header } from 'app/components/PageLayout/Header'
import { TotalTransactions } from 'app/components/TotalTransactions'

export const HomePage: FC = () => {
  const { network } = useSearchQueryNetworkParam()

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner wantedNetwork={network} />
      <Header />
      <div className="flex flex-col border-8 md:border-[15px] px-0 md:px-[4%] pt-4 md:pt-7 md:border-t-0 border-t-0 border-theme-layout-accent">
        <HomeSearch />
        <Ecosystem />
        <div className="flex gap-6 flex-col md:flex-row">
          <RecentBlocksCard />
          <TotalTransactions chartContainerHeight={280} network="mainnet" />
        </div>
        <RoflAppsCard />
        <Social />
      </div>
      <Footer />
    </>
  )
}
