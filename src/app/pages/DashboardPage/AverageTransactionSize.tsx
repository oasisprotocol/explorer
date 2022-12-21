import { FC } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

export const AverageTransactionSize: FC = () => (
  <Card>
    <CardHeader disableTypography component="h3" title="Average Transaction Size" />
    <CardContent></CardContent>
  </Card>
)
