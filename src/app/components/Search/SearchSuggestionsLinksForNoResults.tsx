import { FC } from 'react'
import { searchSuggestionTerms } from '../../components/Search/search-utils'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import WidgetsIcon from '@mui/icons-material/Widgets'
import RepeatIcon from '@mui/icons-material/Repeat'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TokenIcon from '@mui/icons-material/Token'
import { RouteUtils } from '../../utils/route-utils'
import { OptionalBreak } from '../OptionalBreak'
import { SearchScope } from '../../../types/searchScope'
import { useScreenSize } from '../../hooks/useScreensize'
import { SxProps } from '@mui/material/styles'
import { Layer } from '../../../oasis-nexus/api'

interface Props {
  scope: SearchScope | undefined
}

const iconSxProps: SxProps = {
  fontSize: '18px',
  verticalAlign: 'middle',
  marginBottom: 1,
}

const empty = <></>

export const SearchSuggestionsLinksForNoResults: FC<Props> = ({ scope }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const { suggestedBlock, suggestedTransaction, suggestedAccount, suggestedTokenFragment } =
    (scope?.network && scope?.layer && searchSuggestionTerms[scope.network][scope.layer]) ??
    searchSuggestionTerms['mainnet']['sapphire']!
  const defaultComponents = {
    OptionalBreak: <OptionalBreak />,
    BlockIcon: isMobile ? empty : <WidgetsIcon sx={iconSxProps} />,
    BlockLink: <Link component={RouterLink} to={RouteUtils.getSearchRoute(scope, suggestedBlock)} />,
    TransactionIcon: isMobile ? empty : <RepeatIcon sx={iconSxProps} />,
    TransactionLink: (
      <Link component={RouterLink} to={RouteUtils.getSearchRoute(scope, suggestedTransaction)} />
    ),
    AccountIcon: isMobile ? empty : <AccountBalanceWalletIcon sx={iconSxProps} />,
    AccountLink: <Link component={RouterLink} to={RouteUtils.getSearchRoute(scope, suggestedAccount)} />,
  }
  const runtimeComponents = {
    ...defaultComponents,
    TokenIcon: isMobile ? empty : <TokenIcon sx={iconSxProps} />,
    TokenLink: <Link component={RouterLink} to={RouteUtils.getSearchRoute(scope, suggestedTokenFragment)} />,
  }

  return (
    <Trans
      t={t}
      i18nKey={
        scope?.layer === Layer.consensus
          ? 'search.searchSuggestionsForNoResultsForConsensus'
          : 'search.searchSuggestionsForNoResultsForRuntime'
      }
      components={scope?.layer === Layer.consensus ? defaultComponents : runtimeComponents}
    />
  )
}
