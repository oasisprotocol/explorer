import { FC } from 'react'
import { searchSuggestionTerms } from '../../components/Search/search-utils'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import { OptionalBreak } from '../OptionalBreak'

interface Props {}

export const SearchSuggestionsLinks: FC<Props> = () => {
  const { t } = useTranslation()
  const { suggestedBlock, suggestedTransaction, suggestedAccount } = searchSuggestionTerms

  return (
    <Trans
      t={t}
      i18nKey="search.searchSuggestions"
      components={{
        OptionalBreak: <OptionalBreak />,
        BlockIcon: <></>,
        BlockLink: <Link component={RouterLink} to={RouteUtils.getSearchRoute(suggestedBlock)} />,
        TransactionIcon: <></>,
        TransactionLink: <Link component={RouterLink} to={RouteUtils.getSearchRoute(suggestedTransaction)} />,
        AccountIcon: <></>,
        AccountLink: <Link component={RouterLink} to={RouteUtils.getSearchRoute(suggestedAccount)} />,
      }}
    />
  )
}
