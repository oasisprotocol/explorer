import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Trans, useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import WidgetsIcon from '@mui/icons-material/Widgets'
import RepeatIcon from '@mui/icons-material/Repeat'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

const suggestedTransaction = 'b1e68ca814d913064bd6b9460efcb64b4c6d07f3b98fa659beed46164398a830'
const suggestedBlock = '1396255'
const suggestedAccount = '0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3'

const PlainTextButton = styled(Button)({
  fontSize: 'inherit',
  textTransform: 'none',
  paddingLeft: 0,
  paddingRight: 0,
  minWidth: 0,
  height: '1em',
})
const SuggestionButton = styled(PlainTextButton)({
  gap: '0.2ch', // Space after icon
})

export interface SearchSuggestionsProps {
  onClickSuggestion: (suggestion: string) => void
}

export const SearchSuggestions: FC<SearchSuggestionsProps> = ({ onClickSuggestion }) => {
  const { t } = useTranslation()

  return (
    <span>
      <Typography component="span" sx={{ color: COLORS.grayExtraDark, fontSize: 12 }}>
        <Trans
          t={t}
          i18nKey="search.searchSuggestions"
          components={{
            // Make this the preferred line break point with inline-block.
            OptionalBreak: <Box as="span" sx={{ display: 'inline-block' }} />,
            BlockIcon: <WidgetsIcon sx={{ fontSize: '18px' }} />,
            BlockLink: (
              <SuggestionButton
                variant="text"
                color="inherit"
                onClick={() => onClickSuggestion(suggestedBlock)}
              />
            ),
            TransactionIcon: <RepeatIcon sx={{ fontSize: '18px' }} />,
            TransactionLink: (
              <SuggestionButton
                variant="text"
                color="inherit"
                onClick={() => onClickSuggestion(suggestedTransaction)}
              />
            ),
            AccountIcon: <AccountBalanceWalletIcon sx={{ fontSize: '18px' }} />,
            AccountLink: (
              <SuggestionButton
                variant="text"
                color="inherit"
                onClick={() => onClickSuggestion(suggestedAccount)}
              />
            ),
          }}
        ></Trans>
      </Typography>
    </span>
  )
}
