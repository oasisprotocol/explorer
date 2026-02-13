import { FC } from 'react'
import { searchSuggestionTerms } from './search-utils'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { RouteUtils } from '../../utils/route-utils'
import { OptionalBreak } from '../OptionalBreak'
import { SearchScope } from '../../../types/searchScope'

interface Props {
  scope: SearchScope | undefined
  suggestSearch?: boolean
}

export const SearchSuggestionsLinksForNoResults: FC<Props> = ({ scope, suggestSearch }) => {
  const { t } = useTranslation()
  const { suggestedBlock, suggestedTransaction, suggestedAccount, suggestedTokenFragment } =
    (scope?.network && scope?.layer && searchSuggestionTerms[scope.network][scope.layer]) ??
    searchSuggestionTerms.mainnet.sapphire!
  const defaultComponents = {
    OptionalBreak: <OptionalBreak />,
    BlockLink: (
      <RouterLink
        to={RouteUtils.getSearchRoute(scope, suggestedBlock)}
        className="font-semibold inline-flex items-center gap-1"
      />
    ),
    TransactionLink: (
      <RouterLink
        to={RouteUtils.getSearchRoute(scope, suggestedTransaction)}
        className="font-semibold inline-flex items-center gap-1"
      />
    ),
    AccountLink: (
      <RouterLink
        to={RouteUtils.getSearchRoute(scope, suggestedAccount)}
        className="font-semibold inline-flex items-center gap-1"
      />
    ),
  }
  const runtimeComponents = {
    ...defaultComponents,
    TokenLink: (
      <RouterLink
        to={RouteUtils.getSearchRoute(scope, suggestedTokenFragment)}
        className="font-semibold inline-flex items-center gap-1"
      />
    ),
  }

  return (
    <Trans
      t={t}
      i18nKey={
        suggestSearch
          ? scope?.layer === 'consensus'
            ? 'search.suggestSearchForConsensus'
            : 'search.suggestSearchForRuntime'
          : scope?.layer === 'consensus'
            ? 'search.searchSuggestionsForConsensus'
            : 'search.searchSuggestionsForRuntime'
      }
      components={scope?.layer === 'consensus' ? defaultComponents : runtimeComponents}
    />
  )
}
