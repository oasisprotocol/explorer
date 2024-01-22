import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Unstable_Grid2'
import { LearningMaterialsCard } from 'app/components/LearningMaterialsCard'
import { LearningSection } from '../../components/LearningMaterialsCard/LearningSection'
import { docs } from '../../utils/externalLinks'

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
              description={t('learningMaterials.consensus.transactionsDescription')}
              title={t('learningMaterials.consensus.transactions')}
              url={docs.consensusTransactions}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <LearningSection
              description={t('learningMaterials.consensus.servicesDescription')}
              title={t('learningMaterials.consensus.services')}
              url={docs.consensusServices}
            />
          </Grid>
        </Grid>
        <Grid xs={12} md={3}>
          <LearningSection
            description={t('learningMaterials.consensus.genesisDescription')}
            title={t('learningMaterials.consensus.genesis')}
            url={docs.consensusGenesis}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <Grid sx={{ pb: 3 }}>
            <LearningSection
              description={t('learningMaterials.consensus.vectorsDescription')}
              title={t('learningMaterials.consensus.vectors')}
              url={docs.consensusVectors}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <LearningSection
              description={t('learningMaterials.consensus.cometDescription')}
              title={t('learningMaterials.consensus.comet')}
              url={docs.consensusComet}
            />
          </Grid>
        </Grid>
      </Grid>
    </LearningMaterialsCard>
  )
}
