import { FC } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useParamSearch } from '../../components/Search/search-utils'
import { EmptyState } from '../../components/EmptyState'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import { SearchSuggestionsLinks } from '../../components/Search/SearchSuggestionsLinks'
import { COLORS } from '../../../styles/theme/colors'
import {
  RuntimeAccount,
  RuntimeBlock,
  RuntimeTransaction,
  useGetRuntimeAccountsAddress,
  useGetRuntimeBlockByHeight,
  useGetRuntimeTransactionsTxHash,
  Runtime,
} from '../../../oasis-indexer/api'
import { OptionalBreak } from '../../components/OptionalBreak'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { useRedirectIfSingleResult } from './useRedirectIfSingleResult'

type ConditionalResults<T> = { isLoading: boolean; results: T[] | undefined }
export type SearchQueries = {
  emeraldBlockHeight: ConditionalResults<RuntimeBlock>
  emeraldTxHash: ConditionalResults<RuntimeTransaction>
  consensusAccount: ConditionalResults<RuntimeAccount>
  evmBech32Account: ConditionalResults<RuntimeAccount>
}
function useBlocksConditionally(blockHeight: string | undefined): ConditionalResults<RuntimeBlock> {
  const query = useGetRuntimeBlockByHeight(Runtime.emerald, parseInt(blockHeight!), {
    query: { enabled: !!blockHeight },
  })
  return {
    isLoading: query.isInitialLoading,
    results: query.data?.data ? [query.data?.data] : undefined,
  }
}
function useTransactionsConditionally(txHash: string | undefined): ConditionalResults<RuntimeTransaction> {
  const query = useGetRuntimeTransactionsTxHash(Runtime.emerald, txHash!, { query: { enabled: !!txHash } })
  return {
    isLoading: query.isInitialLoading,
    results: query.data?.data.transactions,
  }
}
function useRuntimeAccountConditionally(address: string | undefined): ConditionalResults<RuntimeAccount> {
  const query = useGetRuntimeAccountsAddress(Runtime.emerald, address!, { query: { enabled: !!address } })
  return {
    isLoading: query.isInitialLoading,
    results: query.data?.data ? [query.data?.data] : undefined,
  }
}

export const SearchResultsPage: FC = () => {
  const q = useParamSearch()
  const searchQueries: SearchQueries = {
    emeraldBlockHeight: useBlocksConditionally(q.blockHeight),
    // TODO: searchQuery.blockHash when API is ready
    emeraldTxHash: useTransactionsConditionally(q.txHash),
    consensusAccount: useRuntimeAccountConditionally(q.consensusAccount),
    // TODO: remove evmBech32Account and use evmAccount when API is ready
    evmBech32Account: useRuntimeAccountConditionally(q.evmBech32Account),
  }

  useRedirectIfSingleResult(searchQueries)

  return <SearchResultsView searchQueries={searchQueries}></SearchResultsView>
}

export const SearchResultsView: FC<{
  searchQueries: SearchQueries
}> = ({ searchQueries }) => {
  const { t } = useTranslation()
  const isAnyLoading = Object.values(searchQueries).some(query => query.isLoading)
  const hasNoResults = !isAnyLoading && Object.values(searchQueries).every(query => !query.results)

  return (
    <PageLayout>
      <Divider variant="layout" />
      {isAnyLoading && (
        <SubPageCard featured title={<Skeleton variant="text"></Skeleton>}>
          <TextSkeleton numberOfRows={7} />
        </SubPageCard>
      )}

      {hasNoResults && (
        <EmptyState
          title={t('search.noResults.header')}
          description={
            <Box sx={{ textAlign: 'center', a: { color: COLORS.white, textDecoration: 'underline' } }}>
              <p>
                <Trans
                  t={t}
                  i18nKey="search.noResults.description"
                  components={{
                    OptionalBreak: <OptionalBreak />,
                    HomeLink: <Link component={RouterLink} to={'/'} />,
                  }}
                ></Trans>
              </p>
              <p>
                <SearchSuggestionsLinks />
              </p>
            </Box>
          }
        />
      )}

      {!isAnyLoading && !hasNoResults && <>TODO: Multiple results</>}
    </PageLayout>
  )
}
