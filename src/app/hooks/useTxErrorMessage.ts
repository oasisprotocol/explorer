import { useTranslation } from 'react-i18next'
import { TxError } from '../../oasis-nexus/api'

export const useTxErrorMessage = (error: TxError | undefined): string | undefined => {
  const { t } = useTranslation()
  if (!error) return undefined
  if (error.module === 'evm' && error.code === 8 && !error.message) {
    // EVM reverted, with missing error message
    return `${t('errors.revertedWithoutMessage')} (${t('errors.code')} ${error.code})`
  } else {
    // Anything else
    return `${error.message} (${t('errors.code')} ${error.code})`
  }
}
