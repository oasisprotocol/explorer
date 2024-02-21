import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { useTokenPrice } from '../../../coin-gecko/api'
import { COLORS } from '../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import { NativeTokenInfo } from '../../../types/ticker'
import { SmallTokenLogo } from '../../components/logo/SmallTokenLogo'
import { getFiatCurrencyForScope } from '../../../config'
import { useScopeParam } from '../../hooks/useScopeParam'

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: `-${theme.spacing(2)}`,
  left: theme.spacing(4),
}))

export const TokenPriceCard: FC<{ token: NativeTokenInfo }> = ({ token }) => {
  const { t } = useTranslation()
  const scope = useScopeParam()
  const fiatCurrency = getFiatCurrencyForScope(scope)
  const priceQuery = useTokenPrice(token.ticker, fiatCurrency)

  const formatFiatParams = {
    value: {
      currency: fiatCurrency,
      maximumFractionDigits: 5,
    } satisfies Intl.NumberFormatOptions,
  }

  const priceString = priceQuery.price
    ? t('common.fiatValueInUSD', {
        value: priceQuery.price,
        formatParams: formatFiatParams,
      })
    : ''

  return (
    <SnapshotCard
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SmallTokenLogo ticker={token.ticker} />
          {t('tokenPrice.header', { ticker: token.ticker })}
        </Box>
      }
    >
      <>
        <StyledBox>
          <CoinGeckoReferral />
        </StyledBox>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography
            component="span"
            sx={{
              variant: 'h2',
              fontWeight: 700,
              fontSize: '32px',
              color: COLORS.brandDark,
            }}
          >
            {priceString}
          </Typography>
        </Box>
      </>
    </SnapshotCard>
  )
}
