import { FC } from 'react'
import { Select } from '@oasisprotocol/ui-library/src/components/select'
import { ChartDuration } from '../../../utils/chart-utils'
import { useTranslation } from 'react-i18next'

interface DurationSelectProps {
  defaultValue?: ChartDuration
  handleChange: (duration: ChartDuration | null) => void
}

export const DurationSelect: FC<DurationSelectProps> = ({
  defaultValue = ChartDuration.TODAY,
  handleChange,
}) => {
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

  return (
    <div className="md:ml-3">
      <Select defaultValue={defaultValue} handleChange={handleChange} options={options} />
    </div>
  )
}
