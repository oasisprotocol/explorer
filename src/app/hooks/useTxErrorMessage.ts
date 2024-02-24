import { useTranslation } from 'react-i18next'
import { TxError } from '../../oasis-nexus/api'

export const useTxErrorMessage = (error: TxError | undefined): string | undefined => {
  const { t } = useTranslation()
  return error ? `${error.message} (${t('errors.code')} ${error.code})` : undefined
}
