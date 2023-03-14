import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useParamSearch } from '../../components/Search/search-utils'
import { useTranslation } from 'react-i18next'
import {
  RuntimeAccount,
  RuntimeBlock,
  RuntimeTransaction,
  useGetRuntimeAccountsAddress,
  useGetRuntimeBlockByHeight,
  useGetRuntimeTransactionsTxHash,
  Runtime,
} from '../../../oasis-indexer/api'
import { useGetRosePrice } from '../../../coin-gecko/api'
import { AccountDetailsView } from '../AccountDetailsPage'
import { BlockDetailView } from '../BlockDetailPage'
import { TransactionDetailView } from '../TransactionDetailPage'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'
import { NoResults } from './NoResults'
import { RouteUtils } from '../../utils/route-utils'
import { Layer } from '../../../config'
import { ResultsGroup } from './ResultsGroup'

function isDefined<T>(item: T): item is NonNullable<T> {
  return item != null
}

type ConditionalResults<T> = { isLoading: boolean; results: T[] }
export type SearchQueries = {
  emeraldBlockHeight: ConditionalResults<RuntimeBlock>
  emeraldTxHash: ConditionalResults<RuntimeTransaction>
  consensusAccount: ConditionalResults<RuntimeAccount>
  evmBech32Account: ConditionalResults<RuntimeAccount>
}
function useBlocksConditionally(blockHeight: string | undefined): ConditionalResults<RuntimeBlock> {
  const queries = [
    useGetRuntimeBlockByHeight(Runtime.emerald, parseInt(blockHeight!), {
      query: { enabled: !!blockHeight && RouteUtils.getEnabledParaTimes().includes(Runtime.emerald) },
    }),
    useGetRuntimeBlockByHeight(Runtime.sapphire, parseInt(blockHeight!), {
      query: { enabled: !!blockHeight && RouteUtils.getEnabledParaTimes().includes(Runtime.sapphire) },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}
function useTransactionsConditionally(txHash: string | undefined): ConditionalResults<RuntimeTransaction> {
  const queries = [
    useGetRuntimeTransactionsTxHash(Runtime.emerald, txHash!, {
      query: { enabled: !!txHash && RouteUtils.getEnabledParaTimes().includes(Runtime.emerald) },
    }),
    useGetRuntimeTransactionsTxHash(Runtime.sapphire, txHash!, {
      query: { enabled: !!txHash && RouteUtils.getEnabledParaTimes().includes(Runtime.sapphire) },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.flatMap(query => query.data?.data.transactions).filter(isDefined),
  }
}
function useRuntimeAccountConditionally(address: string | undefined): ConditionalResults<RuntimeAccount> {
  const queries = [
    useGetRuntimeAccountsAddress(Runtime.emerald, address!, {
      query: { enabled: !!address && RouteUtils.getEnabledParaTimes().includes(Runtime.emerald) },
    }),
    useGetRuntimeAccountsAddress(Runtime.sapphire, address!, {
      query: { enabled: !!address && RouteUtils.getEnabledParaTimes().includes(Runtime.sapphire) },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}

export const SearchResultsPage: FC = () => {
  const q = useParamSearch()
  const rosePriceQuery = useGetRosePrice()
  const searchQueries: SearchQueries = {
    emeraldBlockHeight: useBlocksConditionally(q.blockHeight),
    // TODO: searchQuery.blockHash when API is ready
    emeraldTxHash: useTransactionsConditionally(q.txHash),
    consensusAccount: useRuntimeAccountConditionally(q.consensusAccount),
    // TODO: remove evmBech32Account and use evmAccount when API is ready
    evmBech32Account: useRuntimeAccountConditionally(q.evmBech32Account),
  }

  useRedirectIfSingleResult(searchQueries)

  return (
    <SearchResultsView searchQueries={searchQueries} roseFiatValue={rosePriceQuery.data}></SearchResultsView>
  )
}

export const SearchResultsView: FC<{
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ searchQueries, roseFiatValue }) => {
  const { t } = useTranslation()
  const isAnyLoading = Object.values(searchQueries).some(query => query.isLoading)
  const hasNoResults = !isAnyLoading && Object.values(searchQueries).every(query => query.results.length <= 0)

  return (
    <PageLayout>
      <Divider variant="layout" />
      {isAnyLoading && (
        <SubPageCard featured isLoadingTitle={true}>
          <TextSkeleton numberOfRows={7} />
        </SubPageCard>
      )}

      {hasNoResults && <NoResults />}

      {!isAnyLoading && (
        <>
          <ResultsGroup
            title={t('search.results.blocks.title')}
            results={searchQueries.emeraldBlockHeight.results}
            resultComponent={item => <BlockDetailView isLoading={false} block={item} />}
            link={item => RouteUtils.getBlockRoute(item.round, Layer.Emerald)}
            linkLabel={t('search.results.blocks.viewLink')}
          ></ResultsGroup>

          <ResultsGroup
            title={t('search.results.transactions.title')}
            results={searchQueries.emeraldTxHash.results}
            resultComponent={item => <TransactionDetailView isLoading={false} transaction={item} />}
            link={item => RouteUtils.getTransactionRoute(item.hash, Layer.Emerald)}
            linkLabel={t('search.results.transactions.viewLink')}
          ></ResultsGroup>

          <ResultsGroup
            title={t('search.results.accounts.title')}
            results={[
              ...(searchQueries.consensusAccount.results ?? []),
              ...(searchQueries.evmBech32Account.results ?? []),
            ]}
            resultComponent={item => (
              <AccountDetailsView isLoading={false} account={item} roseFiatValue={roseFiatValue} />
            )}
            link={item => RouteUtils.getAccountRoute(item.address, Layer.Emerald)}
            linkLabel={t('search.results.accounts.viewLink')}
          ></ResultsGroup>
        </>
      )}
    </PageLayout>
  )
}
