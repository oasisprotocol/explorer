import { FC } from 'react'
import { EvmToken, RuntimeAccount } from '../../../oasis-nexus/api'
import { useTranslation } from 'react-i18next'
import { TokenPriceInfo } from '../../../coin-gecko/api'
import { CardEmptyState } from './CardEmptyState'
import { Account } from '../../components/Account'

export const AccountDetailsView: FC<{
  isLoading: boolean
  isError: boolean
  errorCode: any
  account: RuntimeAccount | undefined
  token?: EvmToken
  tokenPriceInfo: TokenPriceInfo
  showLayer?: boolean
}> = ({ isLoading, isError, errorCode, account, token, tokenPriceInfo, showLayer }) => {
  const { t } = useTranslation()
  if (isError) {
    switch (errorCode) {
      case 'ERR_NETWORK':
        return <CardEmptyState label={t('account.cantLoadDetails')} />
      default:
        // TODO: what other error cases do we have?
        console.log('Error code is', errorCode)
    }
  }
  return (
    <Account
      account={account}
      token={token}
      isLoading={isLoading}
      tokenPriceInfo={tokenPriceInfo}
      showLayer={showLayer}
    />
  )
}
