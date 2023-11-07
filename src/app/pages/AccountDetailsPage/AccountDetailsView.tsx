import { FC } from 'react'
import { EvmToken, RuntimeAccount } from '../../../oasis-nexus/api'
import { useTranslation } from 'react-i18next'
import { TokenPriceInfo } from '../../../coin-gecko/api'
import { CardEmptyState } from './CardEmptyState'
import { Account } from '../../components/Account'

export const AccountDetailsView: FC<{
  isLoading: boolean
  isError: boolean
  account: RuntimeAccount | undefined
  token?: EvmToken
  tokenPriceInfo: TokenPriceInfo
  showLayer?: boolean
}> = ({ isLoading, isError, account, token, tokenPriceInfo, showLayer }) => {
  const { t } = useTranslation()
  return isError ? (
    <CardEmptyState label={t('account.cantLoadDetails')} />
  ) : (
    <Account
      account={account}
      token={token}
      isLoading={isLoading}
      tokenPriceInfo={tokenPriceInfo}
      showLayer={showLayer}
    />
  )
}
