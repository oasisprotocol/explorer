import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Validator, ValidatorAggStats } from '../../../oasis-nexus/api'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { CustomProgress } from 'app/components/ProgressBar'
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
          <Typography>({validator?.voting_power.toLocaleString()})</Typography>
        )
      }
      withContentPadding={false}
    >
      {typeof validator?.voting_power === 'number' && stats?.total_voting_power && (
        <>
          <Typography className="font-normal text-xs text-muted-foreground text-left pb-2">
            {t('validator.votingPowerOverall')}
          </Typography>
          <div className="pt-4">
            <CustomProgress
              value={validator.voting_power}
              max={stats.total_voting_power}
              label={
                <span className="font-bold">
                  <PercentageValue
                    adaptMaximumFractionDigits
                    value={validator.voting_power}
                    total={stats.total_voting_power}
                    maximumFractionDigits={2}
                  />
                </span>
              }
            />
          </div>
        </>
      )}
    </SnapshotTextCard>
  )
}
