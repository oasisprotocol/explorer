import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Unstable_Grid2'
import { LearningMaterialsCard } from 'app/components/LearningMaterialsCard'
import { LearningSection } from '../../components/LearningMaterialsCard/LearningSection'
import { docs, marketingPage } from '../../utils/externalLinks'

export const LearningMaterials: FC = () => {
  const { t } = useTranslation()

  return (
    <LearningMaterialsCard>
      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <LearningSection
            description={t('learningMaterials.consensus.description')}
            title={t('learningMaterials.consensus.header')}
            url={docs.consensus}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <Grid sx={{ pb: 3 }}>
            <LearningSection
              description={t('learningMaterials.consensus.tokenomicsDescription')}
              title={t('learningMaterials.consensus.tokenomics')}
              url={marketingPage.tokenomics}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <LearningSection
              description={t('learningMaterials.consensus.manageRoseDescription')}
              title={t('learningMaterials.consensus.manageRose')}
              url={docs.manageTokens}
            />
          </Grid>
        </Grid>
        <Grid xs={12} md={3}>
          <LearningSection
            description={t('learningMaterials.consensus.delegationDescription')}
            title={t('learningMaterials.consensus.delegation')}
            url={docs.delegation}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <Grid sx={{ pb: 3 }}>
            <LearningSection
              description={t('learningMaterials.consensus.validatorsDescription')}
              title={t('learningMaterials.consensus.validators')}
              url={marketingPage.validators}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <LearningSection
              description={t('learningMaterials.consensus.nodeDescription')}
              title={t('learningMaterials.consensus.node')}
              url={docs.node}
            />
          </Grid>
        </Grid>
      </Grid>
    </LearningMaterialsCard>
  )
}
