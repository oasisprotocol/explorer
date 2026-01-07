import { useTranslation } from 'react-i18next'
import { TxError } from '../../oasis-nexus/api'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import * as externalLinks from '../utils/externalLinks'

export const useTxErrorMessage = (error: TxError | undefined) => {
  const { t } = useTranslation()
  if (!error) return {}
  if (
    !error.message &&
    error.module === 'evm' &&
    error.code === oasisRT.evm.ERROR_REVERTED_CODE &&
    error.raw_message?.startsWith('reverted: ')
  ) {
    const hexSignature = oasis.misc.toHex(oasis.misc.fromBase64(error.raw_message.replace('reverted: ', '')))
    return {
      errorMessage: `reverted: 0x${hexSignature} (${t('errors.code')} ${error.code}, ${t('errors.module')}: ${error.module})`,
      decode4BytesErrorLink: externalLinks.dapps.decode4bytes.replace('0xf92ee8a9', hexSignature),
    }
  }
  return {
    errorMessage: `${error.message || error.raw_message} (${t('errors.code')} ${error.code}, ${t('errors.module')}: ${error.module})`,
  }
}
