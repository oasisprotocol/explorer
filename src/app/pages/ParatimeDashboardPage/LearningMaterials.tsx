import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { docs } from '../../utils/externalLinks'
import { getLayerLabels } from '../../utils/content'
import { SpecifiedPerEnabledRuntime } from '../../utils/route-utils'
import { RuntimeScope } from '../../../types/searchScope'
import { LearningMaterialsCard } from 'app/components/LearningMaterialsCard'
import { LearningSection } from '../../components/LearningMaterialsCard/LearningSection'

type Content = {
  description: string
  header: string
  url: string
}
type LayerContent = {
  primary: Content
  secondary: Content
  tertiary: Content
}
const getContent = (t: TFunction) => {
  const labels = getLayerLabels(t)

  return {
    mainnet: {
      emerald: {
        primary: {
          description: t('learningMaterials.emerald.description'),
          header: t('learningMaterials.emerald.header'),
          url: docs.emerald,
        },
        secondary: {
          description: t('learningMaterials.token.description'),
          header: t('learningMaterials.token.header'),
          url: docs.token,
        },
        tertiary: {
          description: t('learningMaterials.transfer.description', { layer: labels.emerald }),
          header: t('learningMaterials.transfer.header'),
          url: docs.paraTimeTransfer,
        },
      },
      sapphire: {
        primary: {
          description: t('learningMaterials.sapphire.description'),
          header: t('learningMaterials.sapphire.header'),
          url: docs.sapphire,
        },
        secondary: {
          description: t('learningMaterials.token.description'),
          header: t('learningMaterials.token.header'),
          url: docs.token,
        },
        tertiary: {
          description: t('learningMaterials.transfer.description', { layer: labels.sapphire }),
          header: t('learningMaterials.transfer.header'),
          url: docs.paraTimeTransfer,
        },
      },
      cipher: undefined,
      pontusxdev: undefined,
      pontusxtest: undefined,
    },
    testnet: {
      emerald: {
        primary: {
          description: t('learningMaterials.emerald.description'),
          header: t('learningMaterials.emerald.header'),
          url: docs.emeraldTestnet,
        },
        secondary: {
          description: t('learningMaterials.testnet.description'),
          header: t('learningMaterials.testnet.header'),
          url: docs.emeraldTestnetNode,
        },
        tertiary: {
          description: t('learningMaterials.emerald.gatewayDescription'),
          header: t('learningMaterials.emerald.gateway'),
          url: docs.emeraldGateway,
        },
      },
      sapphire: {
        primary: {
          description: t('learningMaterials.sapphire.description'),
          header: t('learningMaterials.sapphire.header'),
          url: docs.sapphireTestnet,
        },
        secondary: {
          description: t('learningMaterials.testnet.description'),
          header: t('learningMaterials.testnet.header'),
          url: docs.sapphireTestnetNode,
        },
        tertiary: {
          description: t('learningMaterials.hardhat.description'),
          header: t('learningMaterials.hardhat.header', { layer: labels.sapphire }),
          url: docs.sapphireTestnetHardhat,
        },
      },
      cipher: undefined,
      pontusxdev: {
        primary: {
          description: t('learningMaterials.pontusxdevnet.1.description'),
          header: t('learningMaterials.pontusxdevnet.1.header'),
          url: docs.pontusx1,
        },
        secondary: {
          description: t('learningMaterials.pontusxdevnet.2.description'),
          header: t('learningMaterials.pontusxdevnet.2.header'),
          url: docs.pontusx2,
        },
        tertiary: {
          description: t('learningMaterials.pontusxdevnet.3.description'),
          header: t('learningMaterials.pontusxdevnet.3.header'),
          url: docs.pontusx3,
        },
      },
      pontusxtest: {
        primary: {
          description: t('learningMaterials.pontusxtestnet.1.description'),
          header: t('learningMaterials.pontusxtestnet.1.header'),
          url: docs.pontusx1,
        },
        secondary: {
          description: t('learningMaterials.pontusxtestnet.2.description'),
          header: t('learningMaterials.pontusxtestnet.2.header'),
          url: docs.pontusx2,
        },
        tertiary: {
          description: t('learningMaterials.pontusxtestnet.3.description'),
          header: t('learningMaterials.pontusxtestnet.3.header'),
          url: docs.pontusx3,
        },
      },
    },
    localnet: {
      emerald: {
        primary: {
          description: t('learningMaterials.emerald.description'),
          header: t('learningMaterials.emerald.header'),
          url: docs.emeraldTestnet,
        },
        secondary: {
          description: t('learningMaterials.localnet.description'),
          header: t('learningMaterials.localnet.header'),
          url: docs.emeraldTestnetNode,
        },
        tertiary: {
          description: t('learningMaterials.emerald.gatewayDescription'),
          header: t('learningMaterials.emerald.gateway'),
          url: docs.emeraldGateway,
        },
      },
      sapphire: {
        primary: {
          description: t('learningMaterials.sapphire.description'),
          header: t('learningMaterials.sapphire.header'),
          url: docs.sapphireTestnet,
        },
        secondary: {
          description: t('learningMaterials.localnet.description'),
          header: t('learningMaterials.localnet.header'),
          url: docs.localnet,
        },
        tertiary: {
          description: t('learningMaterials.tools.description'),
          header: t('learningMaterials.tools.header', { layer: 'sapphire' }),
          url: docs.tools,
        },
      },
      cipher: undefined,
      pontusxdev: undefined,
      pontusxtest: undefined,
    },
  } satisfies SpecifiedPerEnabledRuntime<LayerContent>
}

export const LearningMaterials: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { layer, network } = scope
  const content = getContent(t)[network][layer]

  if (!content) {
    return null
  }

  return (
    <LearningMaterialsCard>
      <div className="flex flex-col gap-3 md:flex-row md:h-full">
        <div className="md:flex-1">
          <LearningSection
            description={content.primary.description}
            title={content.primary.header}
            url={content.primary.url}
            className="h-full"
          />
        </div>
        <div className="md:flex-1 flex flex-col gap-3">
          <div className="flex flex-1">
            <LearningSection
              description={content.secondary.description}
              title={content.secondary.header}
              url={content.secondary.url}
            />
          </div>
          <div className="flex flex-1">
            <LearningSection
              description={content.tertiary.description}
              title={content.tertiary.header}
              url={content.tertiary.url}
            />
          </div>
        </div>
      </div>
    </LearningMaterialsCard>
  )
}
