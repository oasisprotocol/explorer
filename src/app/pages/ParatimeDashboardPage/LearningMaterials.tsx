import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Unstable_Grid2'
import Link from '@mui/material/Link'
import Paper, { type PaperProps } from '@mui/material/Paper'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { docs } from '../../utils/externalLinks'
import { Layer } from '../../../oasis-nexus/api'
import { getLayerLabels } from '../../utils/content'
import { Network } from '../../../types/network'
import { SpecifiedPerEnabledLayer } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'

const StyledLink = styled(Link)(() => ({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  backgroundColor: COLORS.brandDark,
  color: COLORS.white,
  boxShadow: '0px 10px 8px rgba(117, 60, 239, 0.1)',
  '&:hover, &:focus-visible': {
    backgroundColor: COLORS.cosmicCobalt,
  },
}))

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
type NetworkContent = Partial<Record<Layer, LayerContent>>
const getContent = (t: TFunction): Record<Network, NetworkContent> => {
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
    },
  } satisfies SpecifiedPerEnabledLayer
}

type LearningSectionProps = PaperProps & {
  description: string
  title: string
  url: string
}

const LearningSection: FC<LearningSectionProps> = ({ description, title, url, ...props }) => {
  return (
    <Paper variant="content" {...props}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.grayMedium }}>
        {description}
      </Typography>
      <StyledLink href={url} rel="noopener noreferrer" target="_blank">
        <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </StyledLink>
    </Paper>
  )
}

export const LearningMaterials: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { layer, network } = scope
  const content = getContent(t)[network][layer]

  if (!content) {
    return null
  }

  return (
    <Card>
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
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
