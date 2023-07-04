import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { ChartDuration } from '../../utils/chart-utils'

const getLabels = (t: TFunction): Record<ChartDuration, string> => ({
  [ChartDuration.TODAY]: t('chartDuration.lastHour'),
  [ChartDuration.WEEK]: t('chartDuration.lastDay'),
  [ChartDuration.MONTH]: t('chartDuration.lastDay'),
  [ChartDuration.ALL_TIME]: t('chartDuration.lastDay'),
})

type SnapshotCardLabelProps = {
  duration: ChartDuration
  value: number | undefined
}
export const SnapshotCardDurationLabel: FC<SnapshotCardLabelProps> = ({ duration, value }) => {
  const { t } = useTranslation()
  const labels = getLabels(t)

  if (!value) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Typography sx={{ fontSize: 12, color: COLORS.grayMedium }}>{labels[duration]}</Typography>
      <Typography sx={{ fontSize: 'inherit' }}>{value.toLocaleString()}</Typography>
    </Box>
  )
}
