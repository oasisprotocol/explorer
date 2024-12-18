import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import { Trans, useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import WidgetsIcon from '@mui/icons-material/Widgets'
import RepeatIcon from '@mui/icons-material/Repeat'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TokenIcon from '@mui/icons-material/Token'
import { searchSuggestionTerms } from './search-utils'
import { OptionalBreak } from '../OptionalBreak'
import { SearchScope } from '../../../types/searchScope'
import { Layer } from '../../../oasis-nexus/api'

const StyledPlainTextButton = styled(Button)({
  fontSize: 'inherit',
  textTransform: 'none',
  paddingLeft: 0,
  paddingRight: 0,
  minWidth: 0,
  height: '1em',
})

const PlainTextButton = (props: ButtonProps) => (
  <StyledPlainTextButton variant="text" color="inherit" {...props} />
)

export const SuggestionButton = styled(PlainTextButton)({
  gap: '0.2ch', // Space after icon
})

interface Props {
  scope: SearchScope | undefined
  onClickSuggestion: (suggestion: string) => void
}

export const SearchSuggestionsButtons: FC<Props> = ({ scope, onClickSuggestion }) => {
  const { t } = useTranslation()
  const { suggestedBlock, suggestedTransaction, suggestedAccount, suggestedTokenFragment } =
    (scope?.network && scope?.layer && searchSuggestionTerms[scope.network][scope.layer]) ??
    searchSuggestionTerms['mainnet']['sapphire']!
  const defaultComponents = {
    OptionalBreak: <OptionalBreak />,
    BlockIcon: <WidgetsIcon sx={{ fontSize: '18px' }} />,
    BlockLink: <SuggestionButton onClick={() => onClickSuggestion(suggestedBlock)} />,
    TransactionIcon: <RepeatIcon sx={{ fontSize: '18px' }} />,
    TransactionLink: <SuggestionButton onClick={() => onClickSuggestion(suggestedTransaction)} />,
    AccountIcon: <AccountBalanceWalletIcon sx={{ fontSize: '18px' }} />,
    AccountLink: <SuggestionButton onClick={() => onClickSuggestion(suggestedAccount)} />,
  }
  const runtimeComponents = {
    ...defaultComponents,
    TokenIcon: <TokenIcon sx={{ fontSize: '18px' }} />,
    TokenLink: <SuggestionButton onClick={() => onClickSuggestion(suggestedTokenFragment)} />,
  }

  return (
    <span>
      <Typography component="span" sx={{ color: COLORS.grayExtraDark, fontSize: 12 }}>
        <Trans
          t={t}
          i18nKey={
            scope?.layer === Layer.consensus
              ? 'search.searchSuggestionsForConsensus'
              : 'search.searchSuggestionsForRuntime'
          }
          components={scope?.layer === Layer.consensus ? defaultComponents : runtimeComponents}
        />
      </Typography>
    </span>
  )
}
