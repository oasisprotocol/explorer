import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ShowMoreTokensLink } from './ShowMoreTokensLink'
import { RoundedBalance } from '../RoundedBalance'
import { RuntimeAccount, type RuntimeEvmBalance } from '../../../oasis-indexer/api'
import { RouteUtils } from '../../utils/route-utils'

type TokenPillsProps = {
  account: RuntimeAccount
  tokens: RuntimeEvmBalance[]
}

export const TokenPills: FC<TokenPillsProps> = ({ account, tokens }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
  const tokenRoute = RouteUtils.getAccountTokensRoute(
    account.address_eth ?? account.address,
    account.layer,
    pill.token_type!,
    pill.token_contract_addr,
  )

  return (
    <Chip
      clickable
      color="tertiary"
      component={Link}
      href={tokenRoute}
      key={pill.token_contract_addr}
      label={
        <>
          <RoundedBalance value={pill.balance} ticker={pill.token_symbol} />
        </>
      }
      sx={{ mr: 2 }}
      variant="outlined"
    />
  )
}
