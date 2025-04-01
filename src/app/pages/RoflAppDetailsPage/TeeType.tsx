import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RoflAppPolicy } from '../../../oasis-nexus/api'

type TeeTypeProps = {
  policy: RoflAppPolicy
}

export const TeeType: FC<TeeTypeProps> = ({ policy }) => {
  const { t } = useTranslation()
  const usesTdx = !!policy.quotes?.pcs?.tdx
  const usesSgx = !!policy.quotes?.pcs?.sgx

  if (!usesTdx && !usesSgx) {
    return <>{t('common.missing')}</>
  }

  return (
    <>
      {usesSgx && t('rofl.sgx')}
      {usesSgx && usesTdx && ', '}
      {usesTdx && t('rofl.tdx')}
    </>
  )
}
