import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Typography from '@mui/material/Typography'
import { Validator } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { PieChart } from '../../components/charts/PieChart'
import { RoundedBalance } from '../../components/RoundedBalance'

type BalanceDistributionCardProps = {
  validator?: Validator
}

function chartData(t: TFunction, validator: Validator | undefined) {
  if (
    validator?.escrow?.otherBalance === undefined ||
    validator?.escrow?.self_delegation_balance === undefined
  ) {
    return []
  }

  return [
    {
      label: t('validator.self'),
      value: Number(validator.escrow.self_delegation_balance),
    },
    {
      label: t('validator.others'),
      value: Number(validator.escrow.otherBalance),
    },
  ]
}

export const BalanceDistributionCard: FC<BalanceDistributionCardProps> = ({ validator }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCard title={t('validator.balanceDistribution')}>
      {validator?.escrow.active_balance && (
        <PieChart
          compact
          prependLegendList={
            <>
              {t('validator.totalEscrow')}
              <Typography sx={{ fontSize: 10 }}>
                {t('common.valueInToken', {
                  ...getPreciseNumberFormat(validator.escrow.active_balance),
                  ticker: validator.ticker,
                })}
              </Typography>
              <RoundedBalance
                compactLargeNumbers
                value={validator?.escrow.active_shares}
                ticker={t('common.shares')}
              />
            </>
          }
          data={chartData(t, validator)}
          dataKey="value"
          formatters={{
            data: (value: number) =>
              t('common.valueInToken', {
                ...getPreciseNumberFormat(value.toString()),
                ticker: validator.ticker,
              }),
            label: (label: string) => label,
          }}
        />
      )}
    </SnapshotCard>
  )
}
