import { FC } from 'react'
import { Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'
import { ResultsGroup } from './ResultsGroup'
import { BlockDetailView } from '../BlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { TransactionDetailView } from '../TransactionDetailPage'
import { AccountDetailsView } from '../AccountDetailsPage'
import { SearchQueries } from './hooks'

export const SearchResultsList: FC<{
  network: Network
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ network, searchQueries, roseFiatValue }) => {
  const { t } = useTranslation()
  return (
    <>
      <ResultsGroup
        title={t('search.results.blocks.title')}
        results={searchQueries.blockHeight.results.filter(result => result.network === network)}
        resultComponent={item => <BlockDetailView isLoading={false} block={item} showLayer={true} />}
        link={item => RouteUtils.getBlockRoute(item.network, item.round, item.layer)}
        linkLabel={t('search.results.blocks.viewLink')}
      />

      <ResultsGroup
        title={t('search.results.transactions.title')}
        results={searchQueries.txHash.results.filter(result => result.network === network)}
        resultComponent={item => (
          <TransactionDetailView isLoading={false} transaction={item} showLayer={true} />
        )}
        link={item => RouteUtils.getTransactionRoute(item.network, item.eth_hash || item.hash, item.layer)}
        linkLabel={t('search.results.transactions.viewLink')}
      />

      <ResultsGroup
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
        link={item => RouteUtils.getAccountRoute(item.network, item.address_eth ?? item.address, item.layer)}
        linkLabel={t('search.results.accounts.viewLink')}
      />
    </>
  )
}
