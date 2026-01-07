import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'

type LayerStatusProps = {
  isOutOfDate?: boolean
  withTooltip?: boolean
}

type LayerStatusIconProps = {
  tooltip?: boolean
}

const OutOfDateLayerStatusIcon: FC<LayerStatusIconProps> = ({ tooltip }) => {
  const { t } = useTranslation()
  const errorIcon = <div className="w-2 h-2 rounded-full bg-destructive" />

  return tooltip ? <Tooltip title={t('common.outOfDate')}>{errorIcon}</Tooltip> : errorIcon
}

const LayerStatusIcon: FC<LayerStatusIconProps> = ({ tooltip }) => {
  const { t } = useTranslation()
  const successIcon = <div className="w-2 h-2 rounded-full bg-success" />

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
