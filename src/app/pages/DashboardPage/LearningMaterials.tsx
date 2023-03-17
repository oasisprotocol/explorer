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
import { AppError, AppErrors } from '../../../types/errors'
import { Layer } from '../../../oasis-indexer/api'
import { useLayerParam } from '../../hooks/useLayerParam'

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
  '&:hover': {
    backgroundColor: COLORS.cosmicCobalt,
  },
}))

const getContent = (t: TFunction, layer: Layer) => {
  switch (layer) {
    case Layer.emerald:
      return {
        description: t('learningMaterials.emerald.description'),
        header: t('learningMaterials.emerald.header'),
        link: docs.emerald,
        title: t('common.emerald'),
      }

    case Layer.sapphire:
      return {
        description: t('learningMaterials.sapphire.description'),
        header: t('learningMaterials.sapphire.header'),
        link: docs.sapphire,
        title: t('common.sapphire'),
      }
    default:
      throw new AppError(AppErrors.UnsupportedLayer)
  }
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

export const LearningMaterials = () => {
  const { t } = useTranslation()
  const layer = useLayerParam()
  const content = getContent(t, layer)

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('learningMaterials.header')}
        action={
          <Link
            href={docs.home}
            rel="noopener noreferrer"
            target="_blank"
            sx={{ color: COLORS.brandExtraDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <LearningSection
              description={content.description}
              title={content.header}
              url={content.link}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Grid>
              <LearningSection
                description={t('learningMaterials.token.description')}
                title={t('learningMaterials.token.header')}
                url={docs.token}
              />
            </Grid>
            <Grid>
              <LearningSection
                description={t('learningMaterials.transfer.description', { layer: content.title })}
                title={t('learningMaterials.transfer.header')}
                url={docs.paraTimeTransfer}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
