import { FC } from 'react'
import Card from '@mui/material/Card'
import { useInstanceInfo } from './hook'
import { useAccount } from '../AccountDetailsPage/hook'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import CardContent from '@mui/material/CardContent'
import { TokenTypeTag } from '../../components/Tokens/TokenList'
import { SearchScope } from '../../../types/searchScope'
import { TokenLink } from '../../components/Tokens/TokenLink'
import { useTokenInfo } from '../TokenDashboardPage/hook'

export const InstanceDetailsCard: FC<{ scope: SearchScope; contractAddress: string; instanceId: string }> = ({
  scope,
  contractAddress,
  instanceId,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  const { token, isLoading: tokenLoading } = useTokenInfo(scope, contractAddress)
  const { instance, isLoading: instanceIsLoading } = useInstanceInfo(scope, contractAddress, instanceId)

  const { account, isLoading: accountIsLoading } = useAccount(scope, contractAddress)
  const isLoading = instanceIsLoading || accountIsLoading || tokenLoading

  return (
    <Card>
      <CardContent>
        {isLoading && <TextSkeleton numberOfRows={7} />}
        {!isLoading && account && instance && (
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('tokens.instanceId')}</dt>
            <dd>{instance.id}</dd>

            {instance.name && (
              <>
                <dt>{t('common.name')}</dt>
                <dd>{instance.name}</dd>
              </>
            )}

            <dt>{t('common.collection')} </dt>
            <dd>
              <TokenLink scope={scope} address={contractAddress} name={instance.token_name} />
            </dd>

            <dt>{t('common.type')} </dt>
            <dd>
              <TokenTypeTag tokenType={instance.token_type} />
            </dd>

            <dt>{t('tokens.owner')}</dt>
            <dd>
              {/*TODO*/}
              Unknown
            </dd>

            <dt>{t('common.transfers')}</dt>
            <dd>
              42
              {/*TODO*/}
            </dd>

            {/*Transfers*/}

            <dt>{t(isMobile ? 'common.smartContract_short' : 'common.smartContract')}</dt>
            <dd>
              <AccountLink scope={account} address={account.address_eth || account.address} />
              <CopyToClipboard value={account.address_eth || account.address} />
            </dd>

            <dt>{t('contract.verification.title')}</dt>
            <dd>
              <VerificationIcon address_eth={instance.eth_contract_addr!} verified={!!token?.is_verified} />
            </dd>
          </StyledDescriptionList>
        )}
      </CardContent>
    </Card>
  )
}
