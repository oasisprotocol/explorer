import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCard } from './SnapshotCard'

export const ActiveAccounts: FC = () => {
  const { t } = useTranslation()

  return <SnapshotCard title={t('activeAccounts.title')}>{/* TODO: Add chart */}</SnapshotCard>
}
