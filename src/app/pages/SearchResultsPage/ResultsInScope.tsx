import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ResultsGroupByType } from './ResultsGroupByType'
import { BlockDetailView } from '../BlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { TransactionDetailView } from '../TransactionDetailPage'
import { AccountDetailsView } from '../AccountDetailsPage'
import { SearchQueries } from './hooks'
import { SearchScope } from '../../../types/searchScope'

/**
 * Component for selectively displaying a subset of search results that belongs to a specific network
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const ResultsInScope: FC<{
  scope: SearchScope
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ scope, searchQueries, roseFiatValue }) => {
  const { network, layer } = scope
  const { t } = useTranslation()
  return (
    <>
      <ResultsGroupByType
        title={t('search.results.blocks.title')}
        results={searchQueries.blockHeight.results.filter(
          block => block.network === network && block.layer === layer,
        )}
        resultComponent={item => <BlockDetailView isLoading={false} block={item} showLayer={true} />}
        link={block => RouteUtils.getBlockRoute(block, block.round)}
        linkLabel={t('search.results.blocks.viewLink')}
      />

      <ResultsGroupByType
        title={t('search.results.transactions.title')}
        results={searchQueries.txHash.results.filter(tx => tx.network === network && tx.layer === layer)}
        resultComponent={item => (
          <TransactionDetailView isLoading={false} transaction={item} showLayer={true} />
        )}
        link={tx => RouteUtils.getTransactionRoute(tx, tx.eth_hash || tx.hash)}
        linkLabel={t('search.results.transactions.viewLink')}
      />

      <ResultsGroupByType
        title={t('search.results.accounts.title')}
        results={[
          ...(searchQueries.oasisAccount.results ?? []).filter(
            acc => acc.network === network && acc.layer === layer,
          ),
          ...(searchQueries.evmBech32Account.results ?? []).filter(
            acc => acc.network === network && acc.layer === layer,
          ),
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
