import { styled } from '@mui/material/styles'
import WarningIcon from '@mui/icons-material/WarningAmber'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { CoinGeckoReferral } from '../CoinGeckoReferral'
import { FiatValueInfo } from './hooks'
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton'

export const FiatMoneyAmountBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 4,
  flex: 1,
}))

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
    <FiatMoneyAmountBox>
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
        {loading && <Skeleton variant="rectangular" sx={{ height: 200 }} />}
      </span>
      {hasUsedCoinGecko && <CoinGeckoReferral />}
    </FiatMoneyAmountBox>
  )
}
