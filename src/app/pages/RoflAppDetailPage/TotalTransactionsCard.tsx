import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

export const TotalTransactionsCard: FC = () => {
  const { t } = useTranslation()

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader disableTypography component="h3" title={t('rofl.totalTransactions')} />
      <CardContent> </CardContent>
    </Card>
  )
}
