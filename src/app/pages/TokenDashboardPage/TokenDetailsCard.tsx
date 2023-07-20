import { FC } from 'react'
import Card from '@mui/material/Card'
import { useTokenInfo } from './hook'
import { useAccount } from '../AccountDetailsPage/hook'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { DelayedContractVerificationIcon, VerificationIcon } from '../../components/ContractVerificationIcon'
import { getNameForTicker, Ticker } from '../../../types/ticker'
import { DelayedContractCreatorInfo } from '../../components/Account/ContractCreatorInfo'
import CardContent from '@mui/material/CardContent'
import { TokenTypeTag } from '../../components/Tokens/TokenList'
import { SearchScope } from '../../../types/searchScope'

export const TokenDetailsCard: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()
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
        {!isLoading && account && token && (
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
              {token.is_verified === undefined ? ( // Workaround for old Nexus versions. TODO: remove when new version of Nexus has been deployed everywhere.
                <DelayedContractVerificationIcon scope={token} contractOasisAddress={token.contract_addr} />
              ) : (
                <VerificationIcon address_eth={token.eth_contract_addr} verified={token.is_verified} />
              )}
            </dd>

            <dt>{t('common.type')} </dt>
            <dd>
              <TokenTypeTag tokenType={token.type} />
            </dd>

            <dt>{t('contract.creator')}</dt>
            <dd>
              <DelayedContractCreatorInfo scope={token} contractOasisAddress={token.contract_addr} />
            </dd>

            <dt>{t('common.balance')} </dt>
            <dd>
              {balance === undefined
                ? t('common.missing')
                : t('common.valueInToken', { value: balance, ticker: tickerName })}
            </dd>
          </StyledDescriptionList>
        )}
      </CardContent>
    </Card>
  )
}
