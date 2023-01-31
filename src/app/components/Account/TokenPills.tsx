import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { ShowMoreTokensLink } from './ShowMoreTokensLink'
import { type Token } from '../../../oasis-indexer/generated/api'

type TokenPillsProps = {
  tokens: Token[]
}

const prioritizedTokensSymbols = ['ROSE', 'WROSE', 'ETH']

export const TokenPills: FC<TokenPillsProps> = ({ tokens }) => {
  const { t } = useTranslation()

  if (!tokens) {
    return <Typography sx={{ opacity: '0.5' }}>{t('account.noTokens')}</Typography>
  }

  const prioritizedPills = tokens?.filter(item => prioritizedTokensSymbols.includes(item.token_symbol))
  const numberOfMissingPills = prioritizedTokensSymbols.length - prioritizedPills.length
  const additionalPills = numberOfMissingPills
    ? tokens
        .filter(item => !prioritizedTokensSymbols.includes(item.token_symbol))
        .slice(0, numberOfMissingPills)
    : []
  const pills = [...prioritizedPills, ...additionalPills]

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
