import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Link from '@mui/material/Link'
import { COLORS } from '../../../styles/theme/colors'
import { docs } from '../../utils/externalLinks'

type LearningMaterialsCardProps = {
  children: React.ReactNode
}

export const LearningMaterialsCard: FC<LearningMaterialsCardProps> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        disableTypography
        component="h3"
        title={t('learningMaterials.header')}
        action={
          <Link href={docs.home} rel="noopener noreferrer" target="_blank" sx={{ color: COLORS.brandDark }}>
            {t('common.viewAll')}
          </Link>
        }
      />
      <div className="md:h-[-webkit-fill-available]">{children}</div>
    </Card>
  )
}
