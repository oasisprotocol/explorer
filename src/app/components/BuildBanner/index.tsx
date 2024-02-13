import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { deploys, getAppTitle } from '../../../config'
import { StickyAlert } from '../StickyAlert'

const useBuildBanners = process.env.REACT_APP_SHOW_BUILD_BANNERS === 'true'

export const BuildBanner: FC = () => {
  const { t } = useTranslation()

  if (!useBuildBanners || window.location.origin === deploys.localhost) {
    return null
  }
  if (deploys.production.includes(window.location.origin)) {
    return null
  }
  if (deploys.staging.includes(window.location.origin)) {
    return <StickyAlert severity="warning">{t('banner.buildStaging')}</StickyAlert>
  }
  return <StickyAlert severity="warning">{t('banner.buildPreview', { appTitle: getAppTitle() })}</StickyAlert>
}
