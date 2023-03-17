import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { Trans, useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import WidgetsIcon from '@mui/icons-material/Widgets'
import RepeatIcon from '@mui/icons-material/Repeat'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { searchSuggestionTerms } from './search-utils'
import { OptionalBreak } from '../OptionalBreak'

const PlainTextButton = styled(Button)({
  fontSize: 'inherit',
  textTransform: 'none',
  paddingLeft: 0,
  paddingRight: 0,
  minWidth: 0,
  height: '1em',
})
PlainTextButton.defaultProps = {
  variant: 'text',
  color: 'inherit',
}

export const SuggestionButton = styled(PlainTextButton)({
  gap: '0.2ch', // Space after icon
})

interface Props {
  onClickSuggestion: (suggestion: string) => void
}

export const SearchSuggestionsButtons: FC<Props> = ({ onClickSuggestion }) => {
  const { t } = useTranslation()
  const { suggestedBlock, suggestedTransaction, suggestedAccount } = searchSuggestionTerms

  return (
    <span>
      <Typography component="span" sx={{ color: COLORS.grayExtraDark, fontSize: 12 }}>
        <Trans
          t={t}
          i18nKey="search.searchSuggestions"
          components={{
            OptionalBreak: <OptionalBreak />,
            BlockIcon: <WidgetsIcon sx={{ fontSize: '18px' }} />,
            BlockLink: <SuggestionButton onClick={() => onClickSuggestion(suggestedBlock)} />,
            TransactionIcon: <RepeatIcon sx={{ fontSize: '18px' }} />,
            TransactionLink: <SuggestionButton onClick={() => onClickSuggestion(suggestedTransaction)} />,
            AccountIcon: <AccountBalanceWalletIcon sx={{ fontSize: '18px' }} />,
            AccountLink: <SuggestionButton onClick={() => onClickSuggestion(suggestedAccount)} />,
          }}
        />
      </Typography>
    </span>
  )
}
