import { useTranslation } from 'react-i18next'
import { TxError } from '../../oasis-nexus/api'

export const useTxErrorMessage = (error: TxError | undefined): string | undefined => {
  const { t } = useTranslation()
  if (!error) return undefined
  return `${error.message || error.raw_message} (${t('errors.code')} ${error.code}, ${t('errors.module')}: ${error.module})`
}
