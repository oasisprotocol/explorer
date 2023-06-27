import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import * as externalLinks from '../../utils/externalLinks'
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
    return (
      <StickyAlert severity="warning">
        {t('banner.buildStaging')}
        <Link
          component={RouterLink}
          to={externalLinks.feedback.internalForm}
          target="_blank"
          rel="noopener noreferrer"
        >
          {externalLinks.feedback.internalForm}
        </Link>
      </StickyAlert>
    )
  }
  return <StickyAlert severity="warning">{t('banner.buildPreview')}</StickyAlert>
}
