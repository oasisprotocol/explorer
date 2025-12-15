import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import BigNumber from 'bignumber.js'
import { Validator, ValidatorAggStats } from '../../../oasis-nexus/api'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { LabeledProgress } from 'app/components/LabeledProgress'
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
        validator?.voting_power !== undefined && (
          <Typography>({new BigNumber(validator?.voting_power).toFormat()})</Typography>
        )
      }
      withContentPadding={false}
    >
      {validator?.voting_power !== undefined && stats?.total_voting_power && (
        <>
          <Typography className="font-normal text-xs text-muted-foreground text-left pb-2">
            {t('validator.votingPowerOverall')}
          </Typography>
          <div className="pt-4">
            <LabeledProgress
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
