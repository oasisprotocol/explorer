import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { RoflAppMetadata } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { EmptyStateCard } from './EmptyStateCard'
import { GridRow } from './GridRow'
import { isUrlSafe } from '../../utils/url'

export const StyledLink = styled(Link)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  wordBreak: 'break-all',
  gap: 5,
}))

type MetaDataCardProps = {
  isFetched: boolean
  metadata: RoflAppMetadata | undefined
}

// Nexus is not parsing ROFL app metadata, but we can expect props with net.oasis.rofl prefix
// and object to be similar to this:
// https://github.com/oasisprotocol/cli/blob/bb1a57c13ce7bed635e5ce4306cba8ec33c9a651/build/rofl/manifest.go#L185

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
              <GridRow label={t('rofl.roflName')}>{metadata['net.oasis.rofl.name']}</GridRow>
              <GridRow label={t('rofl.description')}>{metadata['net.oasis.rofl.description']}</GridRow>
              <GridRow label={t('rofl.author')}>{metadata['net.oasis.rofl.author']}</GridRow>
              <GridRow label={t('rofl.license')}>{metadata['net.oasis.rofl.license']}</GridRow>
              <GridRow
                label={t('rofl.repositoryUrl')}
                tooltip={
                  <Trans
                    i18nKey="rofl.verifyCommand"
                    t={t}
                    components={{
                      Command: (
                        <Typography variant="mono" component="span">
                          oasis rofl build --verify
                        </Typography>
                      ),
                    }}
                  />
                }
              >
                {isUrlSafe(metadata['net.oasis.rofl.repository']) ? (
                  <StyledLink
                    href={metadata['net.oasis.rofl.repository']}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {metadata['net.oasis.rofl.repository']} <OpenInNewIcon sx={{ fontSize: 20 }} />
                  </StyledLink>
                ) : undefined}
              </GridRow>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}
