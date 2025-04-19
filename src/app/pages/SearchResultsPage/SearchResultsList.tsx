import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ResultsGroupByType } from './ResultsGroupByType'
import { RuntimeBlockDetailView } from '../RuntimeBlockDetailPage'
import { ConsensusBlockDetailView } from '../ConsensusBlockDetailPage'
import { RouteUtils } from '../../utils/route-utils'
import { RuntimeTransactionDetailView } from '../RuntimeTransactionDetailPage'
import { ConsensusTransactionDetailView } from '../ConsensusTransactionDetailPage'
import { RuntimeAccountDetailsView } from '../../components/Account/RuntimeAccountDetailsView'
import { ConsensusAccountDetailsView } from '../../components/Account/ConsensusAccountDetailsView'
import {
  AccountResult,
  BlockResult,
  ContractResult,
  ProposalResult,
  RoflAppResult,
  SearchResults,
  TokenResult,
  TransactionResult,
  isConsensusBlock,
  isConsensusTransaction,
} from './hooks'
import { getThemeForScope } from '../../../styles/theme'
import { Network } from '../../../types/network'
import { SubPageCard } from '../../components/SubPageCard'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { ResultListFrame } from './ResultListFrame'
import { TokenDetails } from '../../components/Tokens/TokenDetails'
import { ProposalDetailView } from '../ProposalDetailsPage'
import { Account, Layer, RuntimeAccount } from '../../../oasis-nexus/api'
import { RoflAppDetailsViewSearchResult } from '../RoflAppDetailsPage'

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
  const theme = getThemeForScope(networkForTheme)

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
          resultComponent={(item: BlockResult) =>
            isConsensusBlock(item) ? (
              <ConsensusBlockDetailView isLoading={false} block={item} showLayer={true} />
            ) : (
              <RuntimeBlockDetailView isLoading={false} block={item} showLayer={true} />
            )
          }
          link={(block: BlockResult) =>
            RouteUtils.getBlockRoute(block, isConsensusBlock(block) ? block.height : block.round)
          }
          linkLabel={t('search.results.blocks.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.transactions.title')}
          results={searchResults.filter(
            (item): item is TransactionResult => item.resultType === 'transaction',
          )}
          resultComponent={item =>
            isConsensusTransaction(item) ? (
              <ConsensusTransactionDetailView
                isLoading={false}
                transaction={item}
                tokenPrices={tokenPrices}
                showLayer={true}
              />
            ) : (
              <RuntimeTransactionDetailView
                isLoading={false}
                transaction={item}
                tokenPrices={tokenPrices}
                showLayer={true}
              />
            )
          }
          link={tx =>
            RouteUtils.getTransactionRoute(tx, isConsensusTransaction(tx) ? tx.hash : tx.eth_hash || tx.hash)
          }
          linkLabel={t('search.results.transactions.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.tokens.title')}
          results={searchResults.filter((item): item is TokenResult => item.resultType === 'token')}
          resultComponent={item => <TokenDetails token={item} highlightedPartOfName={searchTerm} showLayer />}
          link={token => RouteUtils.getTokenRoute(token, token.eth_contract_addr ?? token.contract_addr)}
          linkLabel={t('search.results.tokens.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.accounts.title')}
          results={searchResults.filter((item): item is AccountResult => item.resultType === 'account')}
          resultComponent={item =>
            item.layer === Layer.consensus ? (
              <ConsensusAccountDetailsView
                isLoading={false}
                isError={false}
                account={item as Account}
                showLayer={true}
                highlightedPartOfName={searchTerm}
              />
            ) : (
              <RuntimeAccountDetailsView
                isLoading={false}
                isError={false}
                account={item as RuntimeAccount}
                tokenPrices={tokenPrices}
                showLayer={true}
                highlightedPartOfName={searchTerm}
              />
            )
          }
          link={acc => RouteUtils.getAccountRoute(acc, (acc as RuntimeAccount).address_eth ?? acc.address)}
          linkLabel={t('search.results.accounts.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.contracts.title')}
          results={searchResults.filter((item): item is ContractResult => item.resultType === 'contract')}
          resultComponent={item => (
            <RuntimeAccountDetailsView
              isLoading={false}
              isError={false}
              account={item}
              tokenPrices={tokenPrices}
              showLayer={true}
              highlightedPartOfName={searchTerm}
            />
          )}
          link={acc => RouteUtils.getAccountRoute(acc, acc.address_eth ?? acc.address)}
          linkLabel={t('search.results.contracts.viewLink')}
        />

        <ResultsGroupByType
          title={t('search.results.roflApps.title')}
          results={searchResults.filter((item): item is RoflAppResult => item.resultType === 'roflApp')}
          resultComponent={item => (
            <RoflAppDetailsViewSearchResult isLoading={false} app={item} highlightedPartOfName={searchTerm} />
          )}
          link={item => RouteUtils.getRoflAppRoute(item.network, item.id)}
          linkLabel={t('search.results.roflApps.viewLink')}
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
