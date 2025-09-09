import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { docs } from '../../utils/externalLinks'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

type LearningMaterialsCardProps = {
  children: React.ReactNode
}

export const LearningMaterialsCard: FC<LearningMaterialsCardProps> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <div className="flex justify-between mb-4">
        <Typography variant="h3">{t('learningMaterials.header')}</Typography>
        <Link
          href={docs.home}
          rel="noopener noreferrer"
          target="_blank"
          textColor="primary"
          className="font-medium "
        >
          {t('common.viewAll')}
        </Link>
      </div>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
