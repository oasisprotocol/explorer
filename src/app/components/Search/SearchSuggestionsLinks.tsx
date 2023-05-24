import { FC } from 'react'
import { searchSuggestionTerms } from '../../components/Search/search-utils'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import { OptionalBreak } from '../OptionalBreak'
import { Network } from '../../../types/network'

interface Props {
  network?: Network
}

export const SearchSuggestionsLinks: FC<Props> = ({ network }) => {
  const { t } = useTranslation()
  const { suggestedBlock, suggestedTransaction, suggestedAccount } = searchSuggestionTerms

  return (
    <Trans
      t={t}
      i18nKey="search.searchSuggestions"
      components={{
        OptionalBreak: <OptionalBreak />,
        BlockIcon: <></>,
        BlockLink: <Link component={RouterLink} to={RouteUtils.getSearchRoute(network, suggestedBlock)} />,
        TransactionIcon: <></>,
        TransactionLink: (
          <Link component={RouterLink} to={RouteUtils.getSearchRoute(network, suggestedTransaction)} />
        ),
        AccountIcon: <></>,
        AccountLink: (
          <Link component={RouterLink} to={RouteUtils.getSearchRoute(network, suggestedAccount)} />
        ),
      }}
    />
  )
}
