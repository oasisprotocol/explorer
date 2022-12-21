import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

export const AverageTransactionSize: FC = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('averageTransactionSize.header')} />
      <CardContent></CardContent>
    </Card>
  )
}
