import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from '@mui/material/Skeleton'
import { SearchScope } from '../../../types/searchScope'
import { MarketCapTitle } from '../../components/Tokens/MarketCapTitle'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { getTokenMarketCap } from '../../utils/tokens'

type TokenMarketCapCardProps = {
  isLoading: boolean
  rosePriceInUsd: number | undefined
  scope: SearchScope
}

export const TokenMarketCapCard: FC<TokenMarketCapCardProps> = ({ isLoading, rosePriceInUsd, scope }) => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={<MarketCapTitle scope={scope} />} alignWithCardsWithActions>
      {isLoading ? (
        <Skeleton variant="text" />
      ) : (
        rosePriceInUsd && (
          <>
            {t('common.fiatValueInUSD', {
              value: getTokenMarketCap(8.01909111301725e22, rosePriceInUsd), // provide relative_total_value
              formatParams: {
                value: {
                  currency: 'USD',
                } satisfies Intl.NumberFormatOptions,
              },
            })}
          </>
        )
      )}
    </SnapshotTextCard>
  )
}
