import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LearningMaterialsCard } from 'app/components/LearningMaterialsCard'
import { LearningSection } from '../../components/LearningMaterialsCard/LearningSection'
import { docs, marketingPage } from '../../utils/externalLinks'

export const LearningMaterials: FC = () => {
  const { t } = useTranslation()

  return (
    <LearningMaterialsCard>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-3 lg:min-h-80">
          <LearningSection
            description={t('learningMaterials.consensus.description')}
            title={t('learningMaterials.consensus.header')}
            url={docs.consensus}
            className="h-full"
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="flex h-full flex-col gap-3">
            <LearningSection
              className="h-full flex-1"
              description={t('learningMaterials.consensus.tokenomicsDescription')}
              title={t('learningMaterials.consensus.tokenomics')}
              url={marketingPage.tokenomics}
            />
            <LearningSection
              className="h-full flex-1"
              description={t('learningMaterials.consensus.manageRoseDescription')}
              title={t('learningMaterials.consensus.manageRose')}
              url={docs.manageTokens}
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 lg:min-h-80">
          <LearningSection
            description={t('learningMaterials.consensus.delegationDescription')}
            title={t('learningMaterials.consensus.delegation')}
            url={docs.delegation}
            className="h-full"
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="flex h-full flex-col gap-3">
            <LearningSection
              className="h-full flex-1"
              description={t('learningMaterials.consensus.validatorsDescription')}
              title={t('learningMaterials.consensus.validators')}
              url={marketingPage.validators}
            />
            <LearningSection
              className="h-full flex-1"
              description={t('learningMaterials.consensus.nodeDescription')}
              title={t('learningMaterials.consensus.node')}
              url={docs.node}
            />
          </div>
        </div>
      </div>
    </LearningMaterialsCard>
  )
}
