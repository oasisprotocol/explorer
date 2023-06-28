import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import { SnapshotCard } from './SnapshotCard'
import { useGetRosePrice } from '../../../coin-gecko/api'
import { COLORS } from '../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import { SmallLogo } from '../../components/logo/SmallLogo'

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: `-${theme.spacing(2)}`,
  left: theme.spacing(4),
}))

const formatFiatRoseParams = {
  value: {
    currency: 'USD',
    maximumFractionDigits: 5,
  } satisfies Intl.NumberFormatOptions,
}

export const RosePriceCard: FC = () => {
  const { t } = useTranslation()
  const rosePriceQuery = useGetRosePrice()
  const priceString = rosePriceQuery.data
    ? t('common.fiatValueInUSD', {
        value: rosePriceQuery.data,
        formatParams: formatFiatRoseParams,
      })
    : ''

  return (
    <SnapshotCard
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SmallLogo />
          {t('rosePrice.header')}
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
