import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { referrals } from '../../utils/externalLinks'
import { COLORS } from '../../../styles/theme/colors'

export const CoinGeckoReferral: FC = () => {
  const { t } = useTranslation()

  return (
    <Typography component="span" sx={{ fontSize: '12px', color: COLORS.brandExtraDark }}>
      <Trans
        i18nKey="coinGeckoReferral"
        t={t}
        components={{
          CoinGeckoLink: (
            <Link
              href={referrals.coinGecko}
              rel="noopener noreferrer"
              target="_blank"
              sx={{ fontWeight: 400, color: 'inherit', textDecoration: 'underline' }}
            />
          ),
        }}
      />
    </Typography>
  )
}
