import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Validator } from '../../../oasis-nexus/api'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from 'styles/theme/colors'
import { VerticalProgressBar } from 'app/components/ProgressBar'

type VotingPowerCardProps = {
  validator?: Validator
}

export const VotingPowerCard: FC<VotingPowerCardProps> = ({ validator }) => {
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
      {typeof validator?.voting_power === 'number' && validator?.voting_power_total > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: 12, color: COLORS.grayMedium, textAlign: 'left', paddingBottom: 3 }}>
              {t('validator.votingPowerOverall')}
            </Typography>
            {t('common.valuePair', {
              value: validator.voting_power / validator.voting_power_total,
              formatParams: {
                value: {
                  style: 'percent',
                  maximumFractionDigits: 2,
                } satisfies Intl.NumberFormatOptions,
              },
            })}
          </Box>
          <Box sx={{ paddingTop: 4 }}>
            <VerticalProgressBar
              height={80}
              width={50}
              value={(100 * validator.voting_power) / validator.voting_power_total}
              barWithBorder={false}
              barBackgroundColor={COLORS.grayMediumLight}
            />
          </Box>
        </Box>
      )}
    </SnapshotTextCard>
  )
}
