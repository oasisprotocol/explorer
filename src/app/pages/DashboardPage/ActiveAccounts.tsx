import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCard } from './SnapshotCard'
import { BarChart } from '../../components/charts/BarChart'

export const ActiveAccounts: FC = () => {
  const { t } = useTranslation()
  // TODO: sync with BE active accounts endpoint when it's ready

  return (
    <SnapshotCard title={t('activeAccounts.title')} label="1,992,677">
      <BarChart
        data={[]}
        dataKey="active_accounts"
        formatters={{
          data: (value: number) => value.toLocaleString(),
          label: (value: string) =>
            t('common.formattedDateTime', {
              timestamp: new Date(value),
            }),
        }}
        withBarBackground
      />
    </SnapshotCard>
  )
}
