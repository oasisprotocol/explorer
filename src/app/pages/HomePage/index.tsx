import { FC } from 'react'
import { useTranslation } from 'react-i18next'
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
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

export const HomePage: FC = () => {
  const { t } = useTranslation()
  const { network } = useSearchQueryNetworkParam()

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner wantedNetwork={network} />
      <Header />
      <div className="flex flex-col border-8 md:border-[15px] px-0 md:px-[4%] pt-4 md:pt-7 md:border-t-0 border-t-0 border-theme-layout-accent">
        <HomeSearch />
        <Ecosystem />
        <RoflAppsCard />
        <div className="flex gap-6 flex-col md:flex-row">
          <RecentBlocksCard />
          <TotalTransactions
            chartContainerHeight={280}
            network="mainnet"
            title={
              <Typography variant="h3" className="text-lg">
                {t('totalTransactions.header')}
              </Typography>
            }
          />
        </div>
        <Social />
      </div>
      <Footer />
    </>
  )
}
