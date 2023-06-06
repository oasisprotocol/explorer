import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FiatMoneyAmountBox } from '../../components/Account'
import Tooltip from '@mui/material/Tooltip'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import HelpIcon from '@mui/icons-material/Help'
import { TokenPriceInfo } from '../../../coin-gecko/api'

type CurrentFiatValueProps = Pick<TokenPriceInfo, 'price' | 'hasUsedCoinGecko'> & {
  amount: number
}

export const CurrentFiatValue: FC<CurrentFiatValueProps> = ({ amount, price, hasUsedCoinGecko }) => {
  const { t } = useTranslation()
  return price === undefined ? null : (
    <FiatMoneyAmountBox>
      <span>
        {t('common.fiatValueInUSD', {
          value: amount * price,
          formatParams: {
            value: {
              currency: 'USD',
            } satisfies Intl.NumberFormatOptions,
          },
        })}
        &nbsp;
        <Tooltip title={t('currentFiatValue.explanation')}>
          <HelpIcon fontSize="small" />
        </Tooltip>
      </span>
      {hasUsedCoinGecko && <CoinGeckoReferral />}
    </FiatMoneyAmountBox>
  )
}
