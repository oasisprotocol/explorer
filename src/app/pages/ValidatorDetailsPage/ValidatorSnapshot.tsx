import { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled, useTheme } from '@mui/material/styles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useTranslation } from 'react-i18next'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { ExternalLinkCard } from './ExternalLinkCard'
import { SearchScope } from '../../../types/searchScope'
import { UptimeCard } from './UptimeCard'
import { VotingPowerCard } from './VotingPowerCard'
import { BalanceDistributionCard } from './BalanceDistributionCard'
import { Validator } from '../../../oasis-nexus/api'
import { StyledGrid } from '../../components/Snapshots/Snapshot'
import { getHostname } from '../../utils/url'

const StyledTypography = styled(Typography)(() => ({
  fontSize: 18,
  fontWeight: 500,
  textTransform: 'lowercase',
  '::first-letter': {
    textTransform: 'uppercase',
  },
}))

type ValidatorSnapshotProps = {
  scope: SearchScope
  validator?: Validator
}

export const ValidatorSnapshot: FC<ValidatorSnapshotProps> = ({ scope, validator }) => {
  const { t } = useTranslation()

  const theme = useTheme()
  const { isMobile } = useScreenSize()

  return (
    <>
      <Grid container sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Grid item xs={12} sx={{ px: isMobile ? 4 : 0 }}>
          <AppendMobileSearch scope={scope}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 2 }}>
              <Typography variant="h3" sx={{ color: theme.palette.layout.main, fontWeight: 700, mr: 3 }}>
                {t('validator.snapshot')}
              </Typography>
            </Box>
          </AppendMobileSearch>
        </Grid>
      </Grid>

      <Grid container rowSpacing={1} columnSpacing={4} columns={22}>
        <StyledGrid item xs={22} md={6}>
          <BalanceDistributionCard validator={validator} />
        </StyledGrid>
        <StyledGrid item xs={22} md={6}>
          <VotingPowerCard validator={validator} />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          <UptimeCard />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          <ExternalLinkCard
            label={
              <Box gap={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledTypography>{getHostname(validator?.media?.url)}</StyledTypography>
                <OpenInNewIcon sx={{ fontSize: 20 }} />
              </Box>
            }
            link={validator?.media?.url}
          />
        </StyledGrid>
      </Grid>
    </>
  )
}
