import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Alert from '@mui/material/Alert'

const StyledAlert = styled(Alert)(() => ({
  position: 'absolute',
  marginTop: '10px',
  fontSize: '14px',
}))

export const OfflineIndicator: FC = () => {
  const { t } = useTranslation()
  return <StyledAlert severity="error">{t('home.apiOffline')}</StyledAlert>
}
