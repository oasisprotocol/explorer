import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Validator } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { PieChart } from '../../components/charts/PieChart'

type BalanceDistributionCardProps = {
  validator?: Validator
}

function chartData(t: TFunction, validator: Validator | undefined) {
  if (
    validator?.escrow?.active_shares === undefined ||
    validator?.escrow?.self_delegation_shares === undefined
  ) {
    return []
  }

  const activeShares = Number(validator.escrow.active_shares)
  const selfDelegationShares = Number(validator.escrow.self_delegation_shares)
  const otherShares = activeShares - selfDelegationShares

  return [
    {
      label: t('validator.active'),
      value: activeShares,
    },
    {
      label: t('validator.self'),
      value: selfDelegationShares,
    },
    {
      label: t('validator.others'),
      value: otherShares,
    },
  ]
}

export const BalanceDistributionCard: FC<BalanceDistributionCardProps> = ({ validator }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCard title={t('validator.balanceDistribution')}>
      <PieChart
        compact
        data={chartData(t, validator)}
        dataKey="value"
        formatters={{
          data: (value: number) =>
            t('common.valueLong', {
              ...getPreciseNumberFormat(value.toString()),
            }),
          label: (label: string) => label,
        }}
      />
    </SnapshotCard>
  )
}
