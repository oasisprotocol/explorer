import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

const StyledAlert = styled(Alert)(({ theme }) => ({
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

  return <StyledAlert severity="warning">{t('buildPreview')}</StyledAlert>
}
