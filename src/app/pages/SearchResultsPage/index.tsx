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
import { ResultsGroup } from './ResultsGroup'
import { GlobalNetwork, Network, NetworkOrGlobal } from '../../../types/network'
import { useNetworkParam } from '../../hooks/useNetworkParam'

function isDefined<T>(item: T): item is NonNullable<T> {
  return item != null
}

type ConditionalResults<T> = { isLoading: boolean; results: T[] }
export type SearchQueries = {
  blockHeight: ConditionalResults<RuntimeBlock>
  txHash: ConditionalResults<RuntimeTransaction>
  oasisAccount: ConditionalResults<RuntimeAccount>
  evmBech32Account: ConditionalResults<RuntimeAccount>
}
function useBlocksConditionally(
  network: NetworkOrGlobal,
  blockHeight: string | undefined,
): ConditionalResults<RuntimeBlock> {
  const queries = [
    useGetRuntimeBlockByHeight(network as Network, Runtime.emerald, parseInt(blockHeight!), {
      query: {
        enabled:
          !!blockHeight &&
          RouteUtils.getEnabledLayers().includes(Runtime.emerald) &&
          network !== GlobalNetwork, // TODO: enable global search
      },
    }),
    useGetRuntimeBlockByHeight(network as Network, Runtime.sapphire, parseInt(blockHeight!), {
      query: {
        enabled:
          !!blockHeight &&
          RouteUtils.getEnabledLayers().includes(Runtime.sapphire) &&
          network !== GlobalNetwork, // TODO: enable global search
      },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.map(query => query.data?.data).filter(isDefined),
  }
}
function useTransactionsConditionally(
  network: NetworkOrGlobal,
  txHash: string | undefined,
): ConditionalResults<RuntimeTransaction> {
  const queries = [
    useGetRuntimeTransactionsTxHash(network as Network, Runtime.emerald, txHash!, {
      query: {
        enabled:
          !!txHash && RouteUtils.getEnabledLayers().includes(Runtime.emerald) && network !== GlobalNetwork, // TODO: enable global search
      },
    }),
    useGetRuntimeTransactionsTxHash(network as Network, Runtime.sapphire, txHash!, {
      query: {
        enabled:
          !!txHash && RouteUtils.getEnabledLayers().includes(Runtime.sapphire) && network !== GlobalNetwork, // TODO: enable global search
      },
    }),
  ]
  return {
    isLoading: queries.some(query => query.isInitialLoading),
    results: queries.flatMap(query => query.data?.data.transactions).filter(isDefined),
  }
}
function useRuntimeAccountConditionally(
  network: NetworkOrGlobal,
  address: string | undefined,
): ConditionalResults<RuntimeAccount> {
  const queries = [
    useGetRuntimeAccountsAddress(network as Network, Runtime.emerald, address!, {
      query: {
        enabled:
          !!address && RouteUtils.getEnabledLayers().includes(Runtime.emerald) && network !== GlobalNetwork, // TODO: enable global search
      },
    }),
    useGetRuntimeAccountsAddress(network as Network, Runtime.sapphire, address!, {
      query: {
        enabled:
          !!address && RouteUtils.getEnabledLayers().includes(Runtime.sapphire) && network !== GlobalNetwork, // TODO: enable global search
      },
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
  const network = useNetworkParam()
  const searchQueries: SearchQueries = {
    blockHeight: useBlocksConditionally(network, q.blockHeight),
    // TODO: searchQuery.blockHash when API is ready
    txHash: useTransactionsConditionally(network, q.txHash),
    oasisAccount: useRuntimeAccountConditionally(network, q.consensusAccount),
    // TODO: remove evmBech32Account and use evmAccount when API is ready
    evmBech32Account: useRuntimeAccountConditionally(network, q.evmBech32Account),
  }

  useRedirectIfSingleResult(searchQueries)

  return (
    <SearchResultsView network={network} searchQueries={searchQueries} roseFiatValue={rosePriceQuery.data} />
  )
}

export const SearchResultsView: FC<{
  network: NetworkOrGlobal
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ network, searchQueries, roseFiatValue }) => {
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

      {hasNoResults && <NoResults network={network} />}

      {!isAnyLoading && (
        <>
          <ResultsGroup
            title={t('search.results.blocks.title')}
            results={searchQueries.blockHeight.results}
            resultComponent={item => <BlockDetailView isLoading={false} block={item} showLayer={true} />}
            link={item => RouteUtils.getBlockRoute(item.network, item.round, item.layer)}
            linkLabel={t('search.results.blocks.viewLink')}
          />

          <ResultsGroup
            title={t('search.results.transactions.title')}
            results={searchQueries.txHash.results}
            resultComponent={item => (
              <TransactionDetailView isLoading={false} transaction={item} showLayer={true} />
            )}
            link={item =>
              RouteUtils.getTransactionRoute(item.network, item.eth_hash || item.hash, item.layer)
            }
            linkLabel={t('search.results.transactions.viewLink')}
          />

          <ResultsGroup
            title={t('search.results.accounts.title')}
            results={[
              ...(searchQueries.oasisAccount.results ?? []),
              ...(searchQueries.evmBech32Account.results ?? []),
            ]}
            resultComponent={item => (
              <AccountDetailsView
                isLoading={false}
                account={item}
                roseFiatValue={roseFiatValue}
                showLayer={true}
              />
            )}
            link={item =>
              RouteUtils.getAccountRoute(item.network, item.address_eth ?? item.address, item.layer)
            }
            linkLabel={t('search.results.accounts.viewLink')}
          />
        </>
      )}
    </PageLayout>
  )
}
