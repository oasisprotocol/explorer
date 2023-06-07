import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ResultsGroupByType } from './ResultsGroupByType'
import { BlockDetailView } from '../BlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { TransactionDetailView } from '../TransactionDetailPage'
import { AccountDetailsView } from '../AccountDetailsPage'
import { SearchResults } from './hooks'
import { HasScope } from '../../../oasis-indexer/api'
import { getThemesForNetworks } from '../../../styles/theme'
import { Network } from '../../../types/network'
import { SubPageCard } from '../../components/SubPageCard'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { ResultListFrame } from './ResultListFrame'

export type SearchResultFilter = (item: HasScope) => boolean

/**
 * Component for selectively displaying a subset of search results that matched a passed filter,
 * with appropriate theming.
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const SearchResultsFiltered: FC<{
  title: string
  filter: SearchResultFilter
  networkForTheme: Network
  searchResults: SearchResults
  tokenPrices: AllTokenPrices
}> = ({ filter, title, networkForTheme, searchResults, tokenPrices }) => {
  const { t } = useTranslation()

  const numberOfResults = searchResults.allResults.filter(filter).length

  if (!numberOfResults) {
    return null
  }
  const theme = getThemesForNetworks()[networkForTheme]

  return (
    <ResultListFrame theme={theme}>
      <SubPageCard
        title={title}
        featured
        subheader={t('search.results.count', {
          count: numberOfResults,
        })}
      >
        <ResultsGroupByType
          title={t('search.results.blocks.title')}
          results={searchResults.blocks.filter(filter)}
          resultComponent={item => <BlockDetailView isLoading={false} block={item} showLayer={true} />}
          link={block => RouteUtils.getBlockRoute(block, block.round)}
          linkLabel={t('search.results.blocks.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.transactions.title')}
          results={searchResults.transactions.filter(filter)}
          resultComponent={item => (
            <TransactionDetailView
              isLoading={false}
              transaction={item}
              tokenPriceInfo={tokenPrices[item.network]}
              showLayer={true}
            />
          )}
          link={tx => RouteUtils.getTransactionRoute(tx, tx.eth_hash || tx.hash)}
          linkLabel={t('search.results.transactions.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.accounts.title')}
          results={searchResults.accounts.filter(filter)}
          resultComponent={item => (
            <AccountDetailsView
              isLoading={false}
              account={item}
              tokenPriceInfo={tokenPrices[item.network]}
              showLayer={true}
            />
          )}
          link={acc => RouteUtils.getAccountRoute(acc, acc.address_eth ?? acc.address)}
          linkLabel={t('search.results.accounts.viewLink')}
        />
      </SubPageCard>
    </ResultListFrame>
  )
}
