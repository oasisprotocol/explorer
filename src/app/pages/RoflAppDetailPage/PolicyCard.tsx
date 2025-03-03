import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { RoflAppPolicy } from '../../../oasis-nexus/api'
import { EmptyStateCard } from './EmptyStateCard'

type PolicyCardProps = {
  isFetched: boolean
  policy: RoflAppPolicy | undefined
}

export const PolicyCard: FC<PolicyCardProps> = ({ isFetched, policy }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader disableTypography component="h3" title={t('rofl.policy')} />
      <CardContent>{isFetched && !policy && <EmptyStateCard />}</CardContent>
    </Card>
  )
}
