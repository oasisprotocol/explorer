import { FC } from 'react'
import { Search } from '../../components/Search'
import { Footer } from '../../components/PageLayout/Footer'
import { useTranslation } from 'react-i18next'
import { BuildBanner } from '../../components/BuildBanner'
import { useSearchQueryNetworkParam } from '../../hooks/useSearchQueryNetworkParam'
import { NetworkOfflineBanner } from '../../components/OfflineBanner'
import { useIsApiReachable } from '../../components/OfflineBanner/hook'

export const HomePage: FC = () => {
  const { t } = useTranslation()
  const { network } = useSearchQueryNetworkParam()
  const isApiReachable = useIsApiReachable(network).reachable

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner wantedNetwork={network} />
      <Search disabled={!isApiReachable} />
      <Footer />
    </>
  )
}
