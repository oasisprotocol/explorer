import { FC } from 'react'
import { Footer } from '../../components/PageLayout/Footer'
import { BuildBanner } from '../../components/BuildBanner'
import { useSearchQueryNetworkParam } from '../../hooks/useSearchQueryNetworkParam'
import { NetworkOfflineBanner } from '../../components/OfflineBanner'
import { Social } from '../../components/Social'
import { RoflAppsCard } from './RoflAppsCard'
import { HomeSearch } from './HomeSearch'

export const HomePage: FC = () => {
  const { network } = useSearchQueryNetworkParam()

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner wantedNetwork={network} />
      <div className="flex flex-col px-6">
        <HomeSearch />
        <RoflAppsCard />
        <Social />
      </div>
      <Footer />
    </>
  )
}
