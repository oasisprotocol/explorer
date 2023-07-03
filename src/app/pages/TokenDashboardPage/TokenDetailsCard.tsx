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
import { DelayedContractVerificationIcon } from '../../components/ContractVerificationIcon'
import { getTokenTypeName } from './TokenTypeCard'
import { getNameForTicker, Ticker } from '../../../types/ticker'
import { DelayedContractCreatorInfo } from '../../components/Account/ContractCreatorInfo'
import CardContent from '@mui/material/CardContent'

export const TokenDetailsCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string
  const { isMobile } = useScreenSize()

  const { token, isLoading: tokenIsLoading } = useTokenInfo(scope, address)
  const { account, isLoading: accountIsLoading } = useAccount(scope, address)
  const isLoading = tokenIsLoading || accountIsLoading

  const balance = account?.balances[0]?.balance
  const nativeToken = account?.ticker || Ticker.ROSE
  const tickerName = getNameForTicker(t, nativeToken)

  return (
    <Card>
      <CardContent>
        {isLoading && <TextSkeleton numberOfRows={7} />}
        {account && token && (
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('common.token')}</dt>
            <dd>{token.name}</dd>

            {isMobile && (
              <>
                <dt>{t('common.ticker')}</dt>
                <dd>{token.symbol}</dd>
              </>
            )}
            <dt>{t(isMobile ? 'common.smartContract_short' : 'common.smartContract')}</dt>
            <dd>
              <AccountLink scope={account} address={account.address_eth || account.address} />
              <CopyToClipboard value={account.address_eth || account.address} />
            </dd>

            <dt>{t('contract.verification.title')}</dt>
            <dd>
              <DelayedContractVerificationIcon scope={token} contractOasisAddress={token.contract_addr} />
            </dd>

            <dt>{t('common.type')} </dt>
            <dd>{getTokenTypeName(t, token.type)} </dd>

            <dt>{t('contract.creator')}</dt>
            <dd>
              <DelayedContractCreatorInfo
                scope={token}
                contractAddress={token.eth_contract_addr || token.contract_addr}
              />
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
      </CardContent>
    </Card>
  )
}
