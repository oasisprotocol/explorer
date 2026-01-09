import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { docs } from '../../utils/externalLinks'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

type LearningMaterialsCardProps = {
  children: React.ReactNode
}

export const LearningMaterialsCard: FC<LearningMaterialsCardProps> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">{t('learningMaterials.header')}</Typography>
          <Link
            href={docs.home}
            rel="noopener noreferrer"
            target="_blank"
            textColor="primary"
            className="font-medium px-4"
          >
            {t('common.viewAll')}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
    </Card>
  )
}
