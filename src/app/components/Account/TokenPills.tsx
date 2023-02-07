import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref } from 'react-router-dom'
import Link from '@mui/material/Link'
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
        <Pill key={item.token_contract_addr} pill={item} />
      ))}

      <ShowMoreTokensLink tokens={tokens} pills={pills} />
    </>
  )
}

type PillProps = {
  pill: Token
}

export const Pill: FC<PillProps> = ({ pill }) => {
  const href = `${useHref(pill.token_type === 'ERC20' ? 'tokens/erc-20' : 'tokens/erc-721')}#${
    pill.token_contract_addr
  }`

  return (
    <Chip
      clickable
      color="tertiary"
      component={Link}
      href={href}
      key={pill.token_contract_addr}
      label={`${pill.balance} ${pill.token_name}`}
      sx={{ mr: 2 }}
      variant="outlined"
    />
  )
}
