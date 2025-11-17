import { FC } from 'react'
import { Search } from '../../components/Search'
import { Footer } from '../../components/PageLayout/Footer'
import { BuildBanner } from '../../components/BuildBanner'
import { useSearchQueryNetworkParam } from '../../hooks/useSearchQueryNetworkParam'
import { NetworkOfflineBanner } from '../../components/OfflineBanner'
import { useIsApiReachable } from '../../components/OfflineBanner/hook'
import { Social } from '../../components/Social'
import { RecentBlocksCard } from './RecentBlocksCard'
import { Ecosystem } from './Ecosystem'

export const HomePage: FC = () => {
  const { network } = useSearchQueryNetworkParam()
  const isApiReachable = useIsApiReachable(network).reachable

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner wantedNetwork={network} />
      <Search disabled={!isApiReachable} />
      <Ecosystem />
      <RecentBlocksCard />
      <Social />
      <Footer />
    </>
  )
}
