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

  // value props have rounding issues. Avoid displaying in text, but they are fine for visualization
  return [
    {
      label: t('validator.self'),
      preciseValue: validator.escrow.self_delegation_balance,
      value: Number(validator.escrow.self_delegation_balance),
    },
    {
      label: t('validator.others'),
      preciseValue: validator.escrow.self_delegation_balance,
      value: Number(validator.escrow.otherBalance),
    },
  ]
}

export const EscrowDistributionCard: FC<BalanceDistributionCardProps> = ({ validator }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCard title={t('validator.escrowDistribution')}>
      {validator?.escrow.active_balance && (
        <PieChart
          compact
          prependLegendList={
            <>
              {t('validator.totalEscrow')}
              <Typography sx={{ fontSize: 10 }}>
                <RoundedBalance
                  compactLargeNumbers
                  value={validator.escrow.active_balance}
                  ticker={validator.ticker}
                />
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
            data: (value, payload) =>
              t('common.valueInToken', {
                ...getPreciseNumberFormat(String(payload!.preciseValue)),
                ticker: validator.ticker,
              }),
            label: (label: string) => label,
          }}
        />
      )}
    </SnapshotCard>
  )
}
