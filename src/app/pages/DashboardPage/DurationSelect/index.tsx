import { FC, memo } from 'react'
import { Select, SelectOptionBase } from '../../../components/Select'
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
      label: t('chartDuration.today'),
      value: ChartDuration.TODAY,
    },
    {
      label: t('chartDuration.thisWeek'),
      value: ChartDuration.WEEK,
    },
    {
      label: t('chartDuration.thisMonth'),
      value: ChartDuration.MONTH,
    },
    {
      label: t('chartDuration.allTime'),
      value: ChartDuration.ALL_TIME,
    },
  ]

  return <Select<DurationOption> defaultValue={defaultValue} handleChange={handleChange} options={options} />
}

export const DurationSelect = memo(DurationSelectCmp)
