import { FC, memo } from 'react'
import { Select, SelectOptionBase } from '../../Select'
import { ChartDuration } from '../../../utils/chart-utils'
import { useTranslation } from 'react-i18next'

interface DurationOption extends SelectOptionBase {
  label: string
  value: ChartDuration
}

interface DurationSelectProps {
  defaultValue?: ChartDuration
  handleChange: (duration: ChartDuration | null) => void
}

const DurationSelectCmp: FC<DurationSelectProps> = ({ defaultValue = ChartDuration.TODAY, handleChange }) => {
  const { t } = useTranslation()

  const options = [
    {
      label: t('chartDuration.pastDay'),
      value: ChartDuration.TODAY,
    },
    {
      label: t('chartDuration.pastWeek'),
      value: ChartDuration.WEEK,
    },
    {
      label: t('chartDuration.pastMonth'),
      value: ChartDuration.MONTH,
    },
    {
      label: t('chartDuration.pastYear'),
      value: ChartDuration.YEAR,
    },
  ]

  return <Select<DurationOption> defaultValue={defaultValue} handleChange={handleChange} options={options} />
}

export const DurationSelect = memo(DurationSelectCmp)
