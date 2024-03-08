import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { SearchScope } from 'types/searchScope'

export const ProposedBlocks: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('validator.proposedBlocks')} />
      <CardContent>{/* TODO: add proposed block paginated list when API is ready */}</CardContent>
    </Card>
  )
}
