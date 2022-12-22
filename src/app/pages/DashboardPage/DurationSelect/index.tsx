import { FC, memo } from 'react'
import { Select, SelectOptionBase } from '../../../components/Select'
import { ChartDuration } from '../../../utils/chart-utils'
import { useConstant } from '../../../hooks/useConstant'

interface DurationOption extends SelectOptionBase {
  label: string
  value: ChartDuration
}

interface DurationSelectProps {
  defaultValue?: ChartDuration
  handleChange: (duration: ChartDuration | null) => void
}

const DurationSelectCmp: FC<DurationSelectProps> = ({ defaultValue = ChartDuration.TODAY, handleChange }) => {
  const options = useConstant<DurationOption[]>(() => [
    {
      label: 'Today',
      value: ChartDuration.TODAY,
    },
    {
      label: 'This week',
      value: ChartDuration.WEEK,
    },
    {
      label: 'This month',
      value: ChartDuration.MONTH,
    },
    {
      label: 'All time',
      value: ChartDuration.ALL_TIME,
    },
  ])

  return <Select<DurationOption> defaultValue={defaultValue} handleChange={handleChange} options={options} />
}

export const DurationSelect = memo(DurationSelectCmp)
