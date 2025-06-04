import { FC } from 'react'
import { SubPageCard } from '../../components/SubPageCard'
import { useTranslation } from 'react-i18next'
import { EvmToken, RuntimeAccount } from '../../../oasis-nexus/api'
import { RuntimeAccountDetailsView } from '../../components/Account/RuntimeAccountDetailsView'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { HighlightPattern } from '../../components/HighlightedText'

type RuntimeAccountDetailsProps = {
  isLoading: boolean
  isError: boolean
  isContract: boolean
  account: RuntimeAccount | undefined
  token: EvmToken | undefined
  tokenPrices: AllTokenPrices
  highlightPattern: HighlightPattern
}

export const RuntimeAccountDetailsCard: FC<RuntimeAccountDetailsProps> = ({
  isLoading,
  isError,
  isContract,
  account,
  token,
  tokenPrices,
  highlightPattern,
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
        highlightPattern={highlightPattern}
      />
    </SubPageCard>
  )
}
