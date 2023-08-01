import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { ShowMoreTokensLink } from './ShowMoreTokensLink'
import { RoundedBalance } from '../RoundedBalance'
import { RuntimeAccount, type RuntimeEvmBalance } from '../../../oasis-nexus/api'
import { RouteUtils } from '../../utils/route-utils'

type TokenPillsProps = {
  account: RuntimeAccount
  tokens: RuntimeEvmBalance[]
}

export const TokenPills: FC<TokenPillsProps> = ({ account, tokens }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (!tokens.length) {
    return <Typography sx={{ opacity: '0.5' }}>{t('account.noTokens')}</Typography>
  }
  const pills = tokens.slice(0, isMobile ? 1 : 3)

  return (
    <>
      {pills.map(item => (
        <Pill key={item.token_contract_addr} account={account} pill={item} />
      ))}

      <ShowMoreTokensLink account={account} tokens={tokens} pills={pills} />
    </>
  )
}

type PillProps = {
  account: RuntimeAccount
  pill: RuntimeEvmBalance
}

export const Pill: FC<PillProps> = ({ account, pill }) => {
  const { t } = useTranslation()
  const tokenRoute = RouteUtils.getAccountTokensRoute(
    account,
    account.address_eth ?? account.address,
    pill.token_type!,
    pill.token_contract_addr_eth ?? pill.token_contract_addr,
  )

  return (
    <Chip
      clickable
      color="tertiary"
      component={RouterLink}
      to={tokenRoute}
      key={pill.token_contract_addr_eth ?? pill.token_contract_addr}
      label={
        <>
          <RoundedBalance value={pill.balance} ticker={pill.token_symbol || t('common.missing')} />
        </>
      }
      sx={{ mr: 2 }}
      variant="outlined"
    />
  )
}
