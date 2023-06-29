import { FC } from 'react'
import Card from '@mui/material/Card'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'
import { useTokenInfo } from './hook'
import { useAccount } from '../AccountDetailsPage/hook'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { ContractVerificationIcon } from '../../components/ContractVerificationIcon'
import { getTokenTypeName } from './TokenTypeCard'
import { getNameForTicker, Ticker } from '../../../types/ticker'
import { ContractCreatorInfo } from '../../components/Account/ContractCreatorInfo'

export const TokenDetailsCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  const { isMobile } = useScreenSize()

  const { token, isLoading: tokenIsLoading } = useTokenInfo(scope, address)
  const { account, isLoading: accountIsLoading } = useAccount(scope, address)
  const isLoading = tokenIsLoading || accountIsLoading

  const contract = account?.evm_contract

  const balance = account?.balances[0]?.balance
  const nativeToken = account?.ticker || Ticker.ROSE
  const tickerName = getNameForTicker(t, nativeToken)

  return (
    <Card>
      {isLoading && <TextSkeleton numberOfRows={7} />}
      {account && token && contract && (
        <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
          <dt>{t('common.token')}</dt>
          <dd>{token.name}</dd>

          <dt>{t(isMobile ? 'common.smartContract_short' : 'common.smartContract')}</dt>
          <dd>
            <AccountLink scope={account} address={account.address_eth || account.address} />
            <CopyToClipboard value={account.address_eth || account.address} />
          </dd>

          <dt>{t('contract.verification.title')}</dt>
          <dd>
            <ContractVerificationIcon
              verified={!!contract?.verification}
              address_eth={account.address_eth!}
            />
          </dd>

          <dt>{t('common.type')} </dt>
          <dd>{getTokenTypeName(t, token.type)} </dd>

          <dt>{t('contract.creator')}</dt>
          <dd>
            <ContractCreatorInfo scope={account} address={contract.eth_creation_tx || contract.creation_tx} />
          </dd>

          <dt>{t('common.balance')} </dt>
          <dd>
            {balance === undefined
              ? t('common.missing')
              : t('common.valueInToken', { value: balance, ticker: tickerName })}
          </dd>

          <dt>{t('common.transactions')}</dt>
          <dd>{account.stats.num_txns.toLocaleString()}</dd>
        </StyledDescriptionList>
      )}
    </Card>
  )
}
