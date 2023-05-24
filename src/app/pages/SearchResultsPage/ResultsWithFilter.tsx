import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ResultsGroupByType } from './ResultsGroupByType'
import { BlockDetailView } from '../BlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { TransactionDetailView } from '../TransactionDetailPage'
import { AccountDetailsView } from '../AccountDetailsPage'
import { SearchQueries } from './hooks'
import { HasScope } from '../../../oasis-indexer/api'

/**
 * Component for selectively displaying a subset of search results that matches a filter
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const ResultsWithFilter: FC<{
  searchQueries: SearchQueries
  filter: (item: HasScope) => boolean
  roseFiatValue: number | undefined
}> = ({ searchQueries, filter, roseFiatValue }) => {
  const { t } = useTranslation()
  return (
    <>
      <ResultsGroupByType
        title={t('search.results.blocks.title')}
        results={searchQueries.blockHeight.results.filter(filter)}
        resultComponent={item => <BlockDetailView isLoading={false} block={item} showLayer={true} />}
        link={block => RouteUtils.getBlockRoute(block, block.round)}
        linkLabel={t('search.results.blocks.viewLink')}
      />

      <ResultsGroupByType
        title={t('search.results.transactions.title')}
        results={searchQueries.txHash.results.filter(filter)}
        resultComponent={item => (
          <TransactionDetailView isLoading={false} transaction={item} showLayer={true} />
        )}
        link={tx => RouteUtils.getTransactionRoute(tx, tx.eth_hash || tx.hash)}
        linkLabel={t('search.results.transactions.viewLink')}
      />

      <ResultsGroupByType
        title={t('search.results.accounts.title')}
        results={[
          ...(searchQueries.oasisAccount.results ?? []).filter(filter),
          ...(searchQueries.evmBech32Account.results ?? []).filter(filter),
        ]}
        resultComponent={item => (
          <AccountDetailsView
            isLoading={false}
            account={item}
            roseFiatValue={roseFiatValue}
            showLayer={true}
          />
        )}
        link={acc => RouteUtils.getAccountRoute(acc, acc.address_eth ?? acc.address)}
        linkLabel={t('search.results.accounts.viewLink')}
      />
    </>
  )
}
