import { FC } from 'react'
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

const docsUrl = 'https://docs.oasis.io/'
const docsPages = {
  emerald: 'dapp/emerald/',
  token: 'general/oasis-network/token-metrics-and-distribution',
  transfer: 'general/manage-tokens/how-to-transfer-rose-into-paratime',
}
const getDocsLink = (document: keyof typeof docsPages) => `${docsUrl}${docsPages[document]}`
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

type LearningSectionProps = PaperProps & {
  description: string
  title: string
  url: string
}

const LearningSection: FC<LearningSectionProps> = ({ description, title, url, ...props }) => {
  return (
    <Paper variant="content" {...props}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
      <StyledLink href={url} rel="noopener noreferrer" target="_blank">
        <ArrowForwardIcon />
      </StyledLink>
    </Paper>
  )
}

export const LearningMaterials = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('learningMaterials.header')}
        action={
          <Link href={docsUrl} rel="noopener noreferrer" target="_blank">
            {t('learningMaterials.learningCenter')}
          </Link>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <LearningSection
              description={t('learningMaterials.emerald.description')}
              title={t('learningMaterials.emerald.header')}
              url={getDocsLink('emerald')}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Grid>
              <LearningSection
                description={t('learningMaterials.token.description')}
                title={t('learningMaterials.emerald.header')}
                url={getDocsLink('token')}
              />
            </Grid>
            <Grid>
              <LearningSection
                description={t('learningMaterials.transfer.description')}
                title={t('learningMaterials.transfer.header')}
                url={getDocsLink('transfer')}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
