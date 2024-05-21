import { FC } from 'react'
import { SubPageCard } from '../../components/SubPageCard'
import { useTranslation } from 'react-i18next'
import { EvmToken, RuntimeAccount } from '../../../oasis-nexus/api'
import { RuntimeAccountDetailsView } from '../../components/Account/RuntimeAccountDetailsView'
import { AllTokenPrices } from '../../../coin-gecko/api'

type RuntimeAccountDetailsProps = {
  isLoading: boolean
  isError: boolean
  isContract: boolean
  account: RuntimeAccount | undefined
  token: EvmToken | undefined
  tokenPrices: AllTokenPrices
  highlightedPartOfName?: string | undefined
}

export const RuntimeAccountDetailsCard: FC<RuntimeAccountDetailsProps> = ({
  isLoading,
  isError,
  isContract,
  account,
  token,
  tokenPrices,
  highlightedPartOfName,
}) => {
  const { t } = useTranslation()
  return (
    <SubPageCard
      featured
      isLoadingTitle={isLoading}
      title={isContract ? t('contract.title') : t('account.title')}
      mainTitle
    >
      <RuntimeAccountDetailsView
        isLoading={isLoading}
        isError={isError}
        account={account}
        token={token}
        tokenPrices={tokenPrices}
        highlightedPartOfName={highlightedPartOfName}
      />
    </SubPageCard>
  )
}
