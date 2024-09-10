import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Validator, ValidatorAggStats } from '../../../oasis-nexus/api'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from 'styles/theme/colors'
import { VerticalProgressBar } from 'app/components/ProgressBar'
import { PercentageValue } from '../../components/PercentageValue'

type VotingPowerCardProps = {
  validator: Validator | undefined
  stats: ValidatorAggStats | undefined
}

export const VotingPowerCard: FC<VotingPowerCardProps> = ({ validator, stats }) => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard
      title={t('validator.votingPower')}
      label={
        typeof validator?.voting_power === 'number' && (
          <Typography sx={{ fontSize: 18, color: COLORS.grayMedium }}>
            ({validator?.voting_power.toLocaleString()})
          </Typography>
        )
      }
      withContentPadding={false}
    >
      {typeof validator?.voting_power === 'number' && stats?.total_voting_power && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: 12, color: COLORS.grayMedium, textAlign: 'left', paddingBottom: 3 }}>
              {t('validator.votingPowerOverall')}
            </Typography>
            <PercentageValue value={validator.voting_power} total={stats.total_voting_power} />
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <VerticalProgressBar
              height={80}
              width={50}
              value={(100 * validator.voting_power) / stats.total_voting_power}
              barWithBorder={false}
              barBackgroundColor={COLORS.grayMediumLight}
            />
          </Box>
        </Box>
      )}
    </SnapshotTextCard>
  )
}
