import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

type LayerStatusProps = {
  valid: boolean
  withLabel?: boolean
}

export const LayerStatus: FC<LayerStatusProps> = ({ valid, withLabel = false }) => {
  const { t } = useTranslation()

  return (
    <>
      {withLabel && (
        <Typography sx={{ fontSize: 10, color: COLORS.paraTimeStatus, mr: 3 }} component="span">
          {valid ? t('common.paraTimeOnline') : t('common.paraTimeOutOfDate')}
        </Typography>
      )}
      {valid ? (
        <CheckCircleIcon sx={{ marginLeft: 2 }} color="success" fontSize="small" />
      ) : (
        <ErrorIcon sx={{ marginLeft: 2 }} color="error" fontSize="small" />
      )}
    </>
  )
}
