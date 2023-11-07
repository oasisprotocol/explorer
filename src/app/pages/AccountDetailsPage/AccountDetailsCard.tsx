import { FC } from 'react'
import { SubPageCard } from '../../components/SubPageCard'
import { useTranslation } from 'react-i18next'
import { EvmToken, RuntimeAccount } from '../../../oasis-nexus/api'
import { AccountDetailsView } from './AccountDetailsView'
import { TokenPriceInfo } from '../../../coin-gecko/api'

type AccountDetailsProps = {
  isLoading: boolean
  isError: boolean
  isContract: boolean
  account: RuntimeAccount | undefined
  token: EvmToken | undefined
  tokenPriceInfo: TokenPriceInfo
}

export const AccountDetailsCard: FC<AccountDetailsProps> = ({
  isLoading,
  isError,
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
        account={account}
        token={token}
        tokenPriceInfo={tokenPriceInfo}
      />
    </SubPageCard>
  )
}
