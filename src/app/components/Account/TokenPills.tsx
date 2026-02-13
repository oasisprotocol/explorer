import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
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
    return <Typography className="text-muted-foreground">{t('account.noTokens')}</Typography>
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
    <RouterLink to={tokenRoute}>
      <Badge className="px-3 py-1.5 bg-blue-100 outline outline-2 outline-offset-[-2px] outline-blue-600 text-base-foreground font-medium">
        <RoundedBalance value={pill.balance} ticker={pill.token_symbol || t('common.missing')} />
      </Badge>
    </RouterLink>
  )
}
