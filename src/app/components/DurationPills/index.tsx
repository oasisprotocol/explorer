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
    <Tabs defaultValue={value}>
      <TabsList className="ml-auto w-full my-2 lg:w-auto lg:my-0">
        {options.map(option => (
          <TabsTrigger key={option.value} value={option.value} onClick={() => handleChange(option.value)}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
