import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ChartDuration } from '../../utils/chart-utils'
import { Tabs, TabsList, TabsTrigger } from '@oasisprotocol/ui-library/src/components/tabs'

type DurationPillsProps = {
  handleChange: (duration: ChartDuration) => void
  value?: ChartDuration
}

export const DurationPills: FC<DurationPillsProps> = ({ handleChange, value }) => {
  const { t } = useTranslation()
  const options = [
    {
      label: t('chartDuration.week'),
      value: ChartDuration.WEEK,
    },
    {
      label: t('chartDuration.month'),
      value: ChartDuration.MONTH,
    },
    {
      label: t('chartDuration.year'),
      value: ChartDuration.YEAR,
    },
  ]

  return (
    // Mobile margin prevents overflow Recharts
    <Tabs defaultValue={value} className="my-2 lg:my-0">
      <TabsList className="ml-auto w-full lg:w-auto">
        {options.map(option => (
          <TabsTrigger key={option.value} value={option.value} onClick={() => handleChange(option.value)}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
