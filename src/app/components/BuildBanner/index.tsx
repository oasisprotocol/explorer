import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { deploys, getAppTitle } from '../../../config'
import { Alert } from '@oasisprotocol/ui-library/src/components/alert'

const useBuildBanners = import.meta.env.REACT_APP_SHOW_BUILD_BANNERS === 'true'

export const BuildBanner: FC = () => {
  const { t } = useTranslation()

  if (!useBuildBanners || window.location.origin === deploys.localhost) {
    return null
  }
  if (deploys.production.includes(window.location.origin)) {
    return null
  }

  const message = deploys.staging.includes(window.location.origin)
    ? t('banner.buildStaging')
    : t('banner.buildPreview', { appTitle: getAppTitle() })

  return (
    <Alert
      variant="warning-filled"
      // classes for [sticky] alert, without being sticky
      className="rounded-none border-0 flex justify-center items-center [&>svg]:-mt-1"
    >
      {message}
    </Alert>
  )
}
