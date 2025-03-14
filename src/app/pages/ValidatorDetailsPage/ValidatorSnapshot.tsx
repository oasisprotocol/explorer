import { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { ExternalLinkCard } from './ExternalLinkCard'
import { SearchScope } from '../../../types/searchScope'
import { UptimeCard } from './UptimeCard'
import { VotingPowerCard } from './VotingPowerCard'
import { EscrowDistributionCard } from './EscrowDistributionCard'
import { Validator, ValidatorAggStats } from '../../../oasis-nexus/api'
import { StyledGrid } from '../../components/Snapshots/Snapshot'

type ValidatorSnapshotProps = {
  scope: SearchScope
  validator: Validator | undefined
  stats: ValidatorAggStats | undefined
}

export const ValidatorSnapshot: FC<ValidatorSnapshotProps> = ({ scope, validator, stats }) => {
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
          <EscrowDistributionCard validator={validator} />
        </StyledGrid>
        <StyledGrid item xs={22} md={6}>
          <VotingPowerCard validator={validator} stats={stats} />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          <UptimeCard />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          <ExternalLinkCard link={validator?.media?.url} />
        </StyledGrid>
      </Grid>
    </>
  )
}
