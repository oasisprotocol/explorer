import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import Tooltip from '@mui/material/Tooltip'

type LayerStatusProps = {
  isOutOfDate?: boolean
  withTooltip?: boolean
}

type LayerStatusIconProps = {
  tooltip?: boolean
}

const OutOfDateLayerStatusIcon: FC<LayerStatusIconProps> = ({ tooltip }) => {
  const { t } = useTranslation()
  const errorIcon = <ErrorIcon color="error" fontSize="small" />

  return tooltip ? <Tooltip title={t('common.outOfDate')}>{errorIcon}</Tooltip> : errorIcon
}

const LayerStatusIcon: FC<LayerStatusIconProps> = ({ tooltip }) => {
  const { t } = useTranslation()
  const successIcon = <CheckCircleIcon color="success" fontSize="small" />

  return tooltip ? <Tooltip title={t('common.online')}>{successIcon}</Tooltip> : successIcon
}

export const LayerStatus: FC<LayerStatusProps> = ({ isOutOfDate, withTooltip = false }) => {
  if (typeof isOutOfDate === 'undefined') {
    return null
  }

  return (
    <>
      {isOutOfDate ? (
        <OutOfDateLayerStatusIcon tooltip={withTooltip} />
      ) : (
        <LayerStatusIcon tooltip={withTooltip} />
      )}
    </>
  )
}
