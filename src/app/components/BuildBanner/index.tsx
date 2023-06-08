import { forwardRef, ForwardRefRenderFunction } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import * as externalLinks from '../../utils/externalLinks'
import { deploys } from '../../../config'

const StyledAlert = styled(Alert)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  justifyContent: 'center',
  borderRadius: 0,
  fontSize: '12px',
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(4)}} 0`,
  },
  [theme.breakpoints.up('md')]: {
    padding: `${theme.spacing(3)}} 0`,
  },
}))

const BuildBannerCmp: ForwardRefRenderFunction<Alert | null> = (_, ref) => {
  const { t } = useTranslation()

  if (window.location.origin === deploys.localhost) {
    return null
  }
  if (window.location.origin === deploys.production) {
    return null
  }
  if (window.location.origin === deploys.staging) {
    return (
      <StyledAlert ref={ref} severity="warning">
        {t('banner.buildStaging')}
        <Link
          component={RouterLink}
          to={externalLinks.feedback.internalForm}
          target="_blank"
          rel="noopener noreferrer"
        >
          {externalLinks.feedback.internalForm}
        </Link>
      </StyledAlert>
    )
  }
  return (
    <StyledAlert ref={ref} severity="warning">
      {t('banner.buildPreview')}
    </StyledAlert>
  )
}

export const BuildBanner = forwardRef(BuildBannerCmp)
