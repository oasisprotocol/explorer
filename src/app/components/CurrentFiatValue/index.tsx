import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FiatMoneyWarning } from '../Balance/FiatMoneyAmount'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { CoinGeckoReferral } from '../CoinGeckoReferral'
import HelpIcon from '@mui/icons-material/Help'
import { TokenPriceInfo } from '../../../coin-gecko/api'
import BigNumber from 'bignumber.js'

type CurrentFiatValueProps = Omit<TokenPriceInfo, 'isLoading' | 'isFree'> & {
  amount: string
}

export const CurrentFiatValue: FC<CurrentFiatValueProps> = ({
  amount,
  price,
  fiatCurrency,
  hasUsedCoinGecko,
  hasFailed,
  ticker,
}) => {
  const { t } = useTranslation()
  return price === undefined && !hasFailed ? null : (
    <div className="flex items-center justify-between gap-1 flex-1">
      <div className="inline-flex items-center">
        {hasFailed ? (
          <FiatMoneyWarning unknownTickers={[ticker]} />
        ) : (
          <>
            {t('common.fiatValueInUSD', {
              value: new BigNumber(amount).multipliedBy(price!).toFixed(),
              formatParams: {
                value: {
                  currency: fiatCurrency,
                } satisfies Intl.NumberFormatOptions,
              },
            })}
            &nbsp;
            <Tooltip title={t('currentFiatValue.explanation')}>
              <HelpIcon />
            </Tooltip>
          </>
        )}
      </div>
      {hasUsedCoinGecko && <CoinGeckoReferral />}
    </div>
  )
}
