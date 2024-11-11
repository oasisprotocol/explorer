import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Unstable_Grid2'
import { docs } from '../../utils/externalLinks'
import { Layer } from '../../../oasis-nexus/api'
import { getLayerLabels } from '../../utils/content'
import { Network } from '../../../types/network'
import { SpecifiedPerEnabledRuntime } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { LearningMaterialsCard } from 'app/components/LearningMaterialsCard'
import { LearningSection } from '../../components/LearningMaterialsCard/LearningSection'
import { AppErrors } from 'types/errors'

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
    [Network.mainnet]: {
      [Layer.emerald]: {
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
          description: t('learningMaterials.transfer.description', { layer: labels['emerald'] }),
          header: t('learningMaterials.transfer.header'),
          url: docs.paraTimeTransfer,
        },
      },
      [Layer.sapphire]: {
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
          description: t('learningMaterials.transfer.description', { layer: labels['sapphire'] }),
          header: t('learningMaterials.transfer.header'),
          url: docs.paraTimeTransfer,
        },
      },
      [Layer.cipher]: undefined,
      [Layer.pontusxdev]: undefined,
      [Layer.pontusxtest]: undefined,
    },
    [Network.testnet]: {
      [Layer.emerald]: {
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
      [Layer.sapphire]: {
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
          header: t('learningMaterials.hardhat.header', { layer: labels['sapphire'] }),
          url: docs.sapphireTestnetHardhat,
        },
      },
      [Layer.cipher]: undefined,
      [Layer.pontusxdev]: {
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
      [Layer.pontusxtest]: {
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
    [Network.localnet]: {
      [Layer.emerald]: {
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
      [Layer.sapphire]: {
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
          header: t('learningMaterials.tools.header', { layer: labels['sapphire'] }),
          url: docs.tools,
        },
      },
      [Layer.cipher]: undefined,
      [Layer.pontusxdev]: undefined,
      [Layer.pontusxtest]: undefined,
    },
  } satisfies SpecifiedPerEnabledRuntime<LayerContent>
}

export const LearningMaterials: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { layer, network } = scope
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const content = getContent(t)[network][layer]

  if (!content) {
    return null
  }

  return (
    <LearningMaterialsCard>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <LearningSection
            description={content.primary.description}
            title={content.primary.header}
            url={content.primary.url}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid xs={12} md={6} spacing={3}>
          <Grid sx={{ pb: 3 }}>
            <LearningSection
              description={content.secondary.description}
              title={content.secondary.header}
              url={content.secondary.url}
            />
          </Grid>
          <Grid>
            <LearningSection
              description={content.tertiary.description}
              title={content.tertiary.header}
              url={content.tertiary.url}
            />
          </Grid>
        </Grid>
      </Grid>
    </LearningMaterialsCard>
  )
}
