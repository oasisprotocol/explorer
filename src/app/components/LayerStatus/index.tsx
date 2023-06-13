import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

type LayerStatusProps = {
  isOutOfDate?: boolean
  withLabel?: boolean
}

export const LayerStatus: FC<LayerStatusProps> = ({ isOutOfDate, withLabel = false }) => {
  const { t } = useTranslation()

  if (typeof isOutOfDate === 'undefined') {
    return null
  }

  return (
    <>
      {withLabel && (
        <Typography sx={{ fontSize: 10, color: COLORS.paraTimeStatus, mr: 3 }} component="span">
          {isOutOfDate ? t('common.paraTimeOutOfDate') : t('common.paraTimeOnline')}
        </Typography>
      )}
      {isOutOfDate ? (
        <ErrorIcon sx={{ marginLeft: 2 }} color="error" fontSize="small" />
      ) : (
        <CheckCircleIcon sx={{ marginLeft: 2 }} color="success" fontSize="small" />
      )}
    </>
  )
}
