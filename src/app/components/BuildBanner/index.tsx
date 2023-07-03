import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { deploys } from '../../../config'
import { StickyAlert } from '../StickyAlert'

export const BuildBanner: FC = () => {
  const { t } = useTranslation()

  if (window.location.origin === deploys.localhost) {
    return null
  }
  if (window.location.origin === deploys.production) {
    return null
  }
  if (window.location.origin === deploys.staging) {
    return <StickyAlert severity="warning">{t('banner.buildStaging')}</StickyAlert>
  }
  return <StickyAlert severity="warning">{t('banner.buildPreview')}</StickyAlert>
}
