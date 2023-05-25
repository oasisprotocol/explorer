import { FC } from 'react'
import { Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'
import { ResultsGroupByType } from './ResultsGroupByType'
import { BlockDetailView } from '../BlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { TransactionDetailView } from '../TransactionDetailPage'
import { AccountDetailsView } from '../AccountDetailsPage'
import { SearchQueries } from './hooks'

/**
 * Component for selectively displaying a subset of search results that belongs to a specific network
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const ResultsOnNetwork: FC<{
  network: Network
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ network, searchQueries, roseFiatValue }) => {
  const { t } = useTranslation()
  return (
    <>
      <ResultsGroupByType
        title={t('search.results.blocks.title')}
        results={searchQueries.blockHeight.results.filter(result => result.network === network)}
        resultComponent={item => <BlockDetailView isLoading={false} block={item} showLayer={true} />}
        link={item => RouteUtils.getBlockRoute(item, item.round)}
        linkLabel={t('search.results.blocks.viewLink')}
      />

      <ResultsGroupByType
        title={t('search.results.transactions.title')}
        results={searchQueries.txHash.results.filter(result => result.network === network)}
        resultComponent={item => (
          <TransactionDetailView isLoading={false} transaction={item} showLayer={true} />
        )}
        link={item => RouteUtils.getTransactionRoute(item, item.eth_hash || item.hash)}
        linkLabel={t('search.results.transactions.viewLink')}
      />

      <ResultsGroupByType
        title={t('search.results.accounts.title')}
        results={[
          ...(searchQueries.oasisAccount.results ?? []).filter(result => result.network === network),
          ...(searchQueries.evmBech32Account.results ?? []).filter(result => result.network === network),
        ]}
        resultComponent={item => (
          <AccountDetailsView
            isLoading={false}
            account={item}
            roseFiatValue={roseFiatValue}
            showLayer={true}
          />
        )}
        link={item => RouteUtils.getAccountRoute(item, item.address_eth ?? item.address)}
        linkLabel={t('search.results.accounts.viewLink')}
      />
    </>
  )
}
