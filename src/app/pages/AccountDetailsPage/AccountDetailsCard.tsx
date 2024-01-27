import { FC } from 'react'
import { SubPageCard } from '../../components/SubPageCard'
import { useTranslation } from 'react-i18next'
import { EvmToken, RuntimeAccount } from '../../../oasis-nexus/api'
import { AccountDetailsView } from './AccountDetailsView'
import { TokenPriceInfo } from '../../../coin-gecko/api'

type AccountDetailsProps = {
  isLoading: boolean
  isError: boolean
  errorCode: any
  isContract: boolean
  account: RuntimeAccount | undefined
  token: EvmToken | undefined
  tokenPriceInfo: TokenPriceInfo
}

export const AccountDetailsCard: FC<AccountDetailsProps> = ({
  isLoading,
  isError,
  errorCode,
  isContract,
  account,
  token,
  tokenPriceInfo,
}) => {
  const { t } = useTranslation()
  return (
    <SubPageCard
      featured
      isLoadingTitle={isLoading}
      title={isContract ? t('contract.title') : t('account.title')}
    >
      <AccountDetailsView
        isLoading={isLoading}
        isError={isError}
        errorCode={errorCode}
        account={account}
        token={token}
        tokenPriceInfo={tokenPriceInfo}
      />
    </SubPageCard>
  )
}
