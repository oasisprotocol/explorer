import { FC } from 'react'
import { EvmToken, RuntimeAccount } from '../../../oasis-nexus/api'
import { useTranslation } from 'react-i18next'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { CardEmptyState } from '../../components/CardEmptyState'
import { Account } from '../../components/Account'

export const AccountDetailsView: FC<{
  isLoading: boolean
  isError: boolean
  account: RuntimeAccount | undefined
  token?: EvmToken
  tokenPrices: AllTokenPrices
  showLayer?: boolean
}> = ({ isLoading, isError, account, token, tokenPrices, showLayer }) => {
  const { t } = useTranslation()
  return isError ? (
    <CardEmptyState label={t('account.cantLoadDetails')} />
  ) : (
    <Account
      account={account}
      token={token}
      isLoading={isLoading}
      tokenPrices={tokenPrices}
      showLayer={showLayer}
    />
  )
}
