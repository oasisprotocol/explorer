import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { referrals } from '../../utils/externalLinks'
export const CoinGeckoReferral: FC = () => {
  const { t } = useTranslation()

  return (
    <span className="text-xs">
      <Trans
        i18nKey="coinGeckoReferral"
        t={t}
        components={{
          CoinGeckoLink: (
            <Link
              href={referrals.coinGecko}
              rel="noopener noreferrer"
              target="_blank"
              className="underline text-inherit"
            />
          ),
        }}
      />
    </span>
  )
}
