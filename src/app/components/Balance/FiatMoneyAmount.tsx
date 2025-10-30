import WarningIcon from '@mui/icons-material/WarningAmber'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { CoinGeckoReferral } from '../CoinGeckoReferral'
import { FiatValueInfo } from './hooks'
import Tooltip from '@mui/material/Tooltip'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'

export const FiatMoneyWarning: FC<{ unknownTickers: string[] }> = ({ unknownTickers }) => {
  const { t } = useTranslation()
  return (
    <Tooltip
      title={t('account.failedToLookUpTickers', { tickers: unknownTickers.join(', ') })}
      placement="top"
    >
      <WarningIcon />
    </Tooltip>
  )
}

export const FiatMoneyAmount: FC<FiatValueInfo> = ({
  value,
  fiatCurrency,
  hasUsedCoinGecko,
  unknownTickers,
  loading,
}) => {
  const { t } = useTranslation()
  const hasFailed = !!unknownTickers.length
  return (
    <div className="flex items-center justify-between gap-1 flex-1">
      <span>
        {!hasFailed ? (
          t('common.fiatValueInUSD', {
            value,
            formatParams: {
              value: {
                currency: fiatCurrency,
              } satisfies Intl.NumberFormatOptions,
            },
          })
        ) : (
          <FiatMoneyWarning unknownTickers={unknownTickers} />
        )}
        {loading && <Skeleton className="h-4" />}
      </span>
      {hasUsedCoinGecko && <CoinGeckoReferral />}
    </div>
  )
}
