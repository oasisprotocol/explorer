import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { RoflAppPolicy } from '../../../oasis-nexus/api'
import { EmptyStateCard } from './EmptyStateCard'
import { GridRow } from './GridRow'

type PolicyCardProps = {
  isFetched: boolean
  policy: RoflAppPolicy | undefined
}

export const PolicyCard: FC<PolicyCardProps> = ({ isFetched, policy }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader disableTypography component="h3" title={t('rofl.policy')} />
      <CardContent>
        {isFetched && !policy && <EmptyStateCard />}
        {policy && (
          <>
            <Grid container spacing={4}>
              <GridRow label={t('rofl.validity')}>{policy.period}</GridRow>
              <GridRow label={t('rofl.evaluation')}>{policy.evaluation}</GridRow>
              <GridRow label={t('rofl.feePolicy')}>{policy.fee}</GridRow>
              <GridRow label={t('rofl.update')}>{policy.update}</GridRow>
              <GridRow label={t('rofl.repositoryUrl')}>{policy.github}</GridRow>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}
