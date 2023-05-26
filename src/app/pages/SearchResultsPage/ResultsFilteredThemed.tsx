import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ResultsGroupByType } from './ResultsGroupByType'
import { BlockDetailView } from '../BlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { TransactionDetailView } from '../TransactionDetailPage'
import { AccountDetailsView } from '../AccountDetailsPage'
import { SearchQueries } from './hooks'
import { HasScope } from '../../../oasis-indexer/api'
import { getThemesForNetworks } from '../../../styles/theme'
import { Network } from '../../../types/network'
import { SubPageCard } from '../../components/SubPageCard'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

const ResultListFrame = styled(Box)(({ theme }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return {
    marginBottom: 20,
    border: isMobile ? 'none' : `solid 15px ${theme.palette.layout.networkBubbleBorder}`,
    background: theme.palette.layout.networkBubbleBackground,
    borderRadius: 12,
    '&& > div > div': {
      // border: '2px solid green',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      paddingLeft: 64,
      paddingRight: 64,
      background: theme.palette.layout.networkBubbleBackground,
    },
    '&& > div > div > div.MuiBox-root': {
      background: theme.palette.layout.networkBubbleBorder,
      borderRadius: 0,
      // border: '2px solid red',
      marginLeft: -64,
      marginTop: -32,
      marginRight: -64,
      paddingLeft: 64,
      paddingRight: 64,
      paddingBottom: 32,
      paddingTop: 32,
    },
    '&& > div > div > div.MuiCardContent-root': {},
    '&& dt, && dd': {
      boxShadow: `0px 1px 0px ${theme.palette.layout.descriptionListSeparator}`,
    },
  }
})

export type ResultFilter = (item: HasScope) => boolean

/**
 * Component for selectively displaying a subset of search results that matches a filter
 *
 * It doesn't actually run a search query, but uses existing results.
 */
const ResultsFiltered: FC<{
  searchQueries: SearchQueries
  filter: ResultFilter
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

/**
 * Component for selectively displaying a subset of search results that matched a passed filter,
 * with appropriate theming.
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const ResultsFilteredThemed: FC<{
  title: string
  filter: ResultFilter
  networkForTheme: Network
  searchQueries: SearchQueries
  numberOfResults: number
  roseFiatValue: number | undefined
}> = ({ filter, title, networkForTheme, searchQueries, numberOfResults, roseFiatValue }) => {
  const { t } = useTranslation()

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
        <ResultsFiltered filter={filter} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />
      </SubPageCard>
    </ResultListFrame>
  )
}
