import { FC, memo } from 'react'
import { Select, SelectOptionBase } from '../Select'
import { ChartDuration } from '../../utils/chart-utils'
import { useConstant } from '../../hooks/useConstant'

interface DurationOption extends SelectOptionBase {
  label: string;
  value: ChartDuration
}

const DurationSelectCmp: FC = () => {
  const options = useConstant<DurationOption[]>(() => [
    {
      label: 'Today',
      value: ChartDuration.TODAY
    },
    {
      label: 'This week',
      value: ChartDuration.WEEK
    },
    {
      label: 'This month',
      value: ChartDuration.MONTH
    },
    {
      label: 'All time',
      value: ChartDuration.ALL_TIME
    }
  ])

  return (
    <Select<DurationOption> options={options} />
  )
}

export const DurationSelect = memo(DurationSelectCmp)
