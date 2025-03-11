import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { RoflAppMetadata } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { EmptyStateCard } from './EmptyStateCard'
import { GridRow } from './GridRow'

export const StyledGrid = styled(Grid)(({ theme }) => ({
  borderBottom: 'solid 1px #F4F5F7',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))

type MetaDataCardProps = {
  isFetched: boolean
  metadata: RoflAppMetadata | undefined
}

export const MetaDataCard: FC<MetaDataCardProps> = ({ isFetched, metadata }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader
        titleTypographyProps={{ variant: 'h1' }}
        disableTypography
        component="h3"
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Box sx={{ flex: 1, whiteSpace: 'nowrap' }}>{t('rofl.metadata')}</Box>
            <Typography component="span" sx={{ fontSize: '12px', color: COLORS.grayDark }}>
              {t('rofl.metadataInfo')}
            </Typography>
          </Box>
        }
      />
      <CardContent>
        {isFetched && !metadata && <EmptyStateCard />}
        {metadata && (
          <>
            <Grid container spacing={4}>
              <GridRow label={t('rofl.roflName')}>{metadata.name}</GridRow>
              <GridRow label={t('rofl.description')}>{metadata.description}</GridRow>
              <GridRow label={t('rofl.author')}>{metadata.author}</GridRow>
              <GridRow label={t('rofl.license')}>{metadata.licence}</GridRow>
              <GridRow label={t('rofl.gitrev')}>{metadata.git}</GridRow>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}
