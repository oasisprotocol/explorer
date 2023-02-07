import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { ShowMoreTokensLink } from './ShowMoreTokensLink'
import { type Token } from '../../../oasis-indexer/api'

type TokenPillsProps = {
  tokens: Token[]
}

export const TokenPills: FC<TokenPillsProps> = ({ tokens }) => {
  const { t } = useTranslation()
  if (!tokens?.length) {
    return <Typography sx={{ opacity: '0.5' }}>{t('account.noTokens')}</Typography>
  }

  const pills = tokens.slice(0, 3)

  return (
    <>
      {pills.map(item => (
        <Chip
          key={item.token_contract_addr}
          sx={{ mr: 2 }}
          label={`${item.balance} ${item.token_name}`}
          variant="outlined"
          color="tertiary"
        />
      ))}
      <ShowMoreTokensLink tokens={tokens} pills={pills} />
    </>
  )
}
