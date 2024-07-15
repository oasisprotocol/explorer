import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FiatMoneyAmountBox } from '../../components/Balance/FiatMoneyAmount'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import HelpIcon from '@mui/icons-material/Help'
import { TokenPriceInfo } from '../../../coin-gecko/api'
import BigNumber from 'bignumber.js'

type CurrentFiatValueProps = Pick<TokenPriceInfo, 'price' | 'fiatCurrency' | 'hasUsedCoinGecko'> & {
  amount: string
}

export const CurrentFiatValue: FC<CurrentFiatValueProps> = ({
  amount,
  price,
  fiatCurrency,
  hasUsedCoinGecko,
}) => {
  const { t } = useTranslation()
  return price === undefined ? null : (
    <FiatMoneyAmountBox>
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {t('common.fiatValueInUSD', {
          value: new BigNumber(amount).multipliedBy(price).toFixed(),
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
      </Box>
      {hasUsedCoinGecko && <CoinGeckoReferral />}
    </FiatMoneyAmountBox>
  )
}
