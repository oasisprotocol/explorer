import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ResultsGroupByType } from './ResultsGroupByType'
import { RuntimeBlockDetailView } from '../RuntimeBlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { RuntimeTransactionDetailView } from '../RuntimeTransactionDetailPage'
import { AccountDetailsView } from '../RuntimeAccountDetailsPage/AccountDetailsView'
import {
  AccountResult,
  AccountAddressResult,
  BlockResult,
  ContractResult,
  ProposalResult,
  SearchResults,
  TokenResult,
  TransactionResult,
} from './hooks'
import { getThemesForNetworks } from '../../../styles/theme'
import { Network } from '../../../types/network'
import { SubPageCard } from '../../components/SubPageCard'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { ResultListFrame } from './ResultListFrame'
import { TokenDetails } from '../../components/Tokens/TokenDetails'
import { ProposalDetailView } from '../ProposalDetailsPage'
import { DeferredRuntimeAccountDetails } from '../RuntimeAccountDetailsPage/DeferredRuntimeAccountDetails'
import { Layer } from '../../../oasis-nexus/api'
import { DeferredConsensusAccountDetails } from '../ConsensusAccountDetailsPage/DeferredConsensusAccountDetails'

/**
 * Component for displaying a list of search results
 * with appropriate theming.
 *
 * It doesn't actually run a search query, but uses existing results.
 */
export const SearchResultsList: FC<{
  title: string
  networkForTheme: Network
  searchResults: SearchResults
  tokenPrices: AllTokenPrices
  searchTerm?: string
}> = ({ title, networkForTheme, searchResults, tokenPrices, searchTerm = '' }) => {
  const { t } = useTranslation()

  const numberOfResults = searchResults.length

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
          results={searchResults.filter((item): item is BlockResult => item.resultType === 'block')}
          resultComponent={item => <RuntimeBlockDetailView isLoading={false} block={item} showLayer={true} />}
          link={block => RouteUtils.getBlockRoute(block, block.round)}
          linkLabel={t('search.results.blocks.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.transactions.title')}
          results={searchResults.filter(
            (item): item is TransactionResult => item.resultType === 'transaction',
          )}
          resultComponent={item => (
            <RuntimeTransactionDetailView
              isLoading={false}
              transaction={item}
              tokenPrices={tokenPrices}
              showLayer={true}
            />
          )}
          link={tx => RouteUtils.getTransactionRoute(tx, tx.eth_hash || tx.hash)}
          linkLabel={t('search.results.transactions.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.accounts.title')}
          results={searchResults.filter((item): item is AccountResult => item.resultType === 'account')}
          resultComponent={item => (
            <AccountDetailsView
              isLoading={false}
              isError={false}
              account={item}
              tokenPrices={tokenPrices}
              showLayer={true}
            />
          )}
          link={acc => RouteUtils.getAccountRoute(acc, acc.address_eth ?? acc.address)}
          linkLabel={t('search.results.accounts.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.accounts.title')}
          results={searchResults.filter(
            (item): item is AccountAddressResult => item.resultType === 'accountAddress',
          )}
          resultComponent={item =>
            item.layer === Layer.consensus ? (
              <DeferredConsensusAccountDetails
                network={item.network}
                address={item.address}
                tokenPrices={tokenPrices}
                showLayer={true}
              />
            ) : (
              <DeferredRuntimeAccountDetails
                network={item.network}
                layer={item.layer}
                address={item.address}
                tokenPrices={tokenPrices}
                showLayer={true}
              />
            )
          }
          link={acc => RouteUtils.getAccountRoute(acc, acc.address)}
          linkLabel={t('search.results.accounts.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.contracts.title')}
          results={searchResults.filter((item): item is ContractResult => item.resultType === 'contract')}
          resultComponent={item => (
            <AccountDetailsView
              isLoading={false}
              isError={false}
              account={item}
              tokenPrices={tokenPrices}
              showLayer={true}
            />
          )}
          link={acc => RouteUtils.getAccountRoute(acc, acc.address_eth ?? acc.address)}
          linkLabel={t('search.results.contracts.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.tokens.title')}
          results={searchResults.filter((item): item is TokenResult => item.resultType === 'token')}
          resultComponent={item => <TokenDetails token={item} highlightedPartOfName={searchTerm} showLayer />}
          link={token => RouteUtils.getTokenRoute(token, token.eth_contract_addr ?? token.contract_addr)}
          linkLabel={t('search.results.tokens.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.proposals.title')}
          results={searchResults.filter((item): item is ProposalResult => item.resultType === 'proposal')}
          resultComponent={item => (
            <ProposalDetailView proposal={item} highlightedPart={searchTerm} showLayer />
          )}
          link={proposal => RouteUtils.getProposalRoute(proposal.network, proposal.id)}
          linkLabel={t('search.results.proposals.viewLink')}
        />
      </SubPageCard>
    </ResultListFrame>
  )
}
