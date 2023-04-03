import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import * as externalLinks from '../../utils/externalLinks'

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

export const BuildPreviewBanner: FC = () => {
  const { t } = useTranslation()

  if (!process.env.REACT_APP_BUILD_PREVIEW) {
    return null
  }
  if (process.env.REACT_APP_BUILD_PREVIEW === 'preview') {
    return <StyledAlert severity="warning">{t('buildPreview')}</StyledAlert>
  }
  if (process.env.REACT_APP_BUILD_PREVIEW === 'internal') {
    return (
      <StyledAlert severity="warning">
        {t('buildInternal')}
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
  throw new Error('Unsupported build preview type')
}
