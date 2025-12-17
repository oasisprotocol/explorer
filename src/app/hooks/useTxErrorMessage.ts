import { useTranslation } from 'react-i18next'
import { TxError } from '../../oasis-nexus/api'

export const useTxErrorMessage = (error: TxError | undefined): string | undefined => {
  const { t } = useTranslation()
  if (!error) {
    return undefined
  }
  if (error.module === 'evm' && error.code === 8 && !error.message && !error.raw_message) {
    // EVM reverted, without any message
    return `${t('errors.revertedWithoutMessage')} (${t('errors.code')} ${error.code}, ${t('errors.module')}: ${error.module})`
  }

  return `${error.message || error.raw_message} (${t('errors.code')} ${error.code}, ${t('errors.module')}: ${error.module})`
}
