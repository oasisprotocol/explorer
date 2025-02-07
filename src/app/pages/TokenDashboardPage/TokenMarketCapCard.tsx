import { FC } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { SearchScope } from '../../../types/searchScope'
import { MarketCapTitle } from '../../components/Tokens/MarketCapTitle'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { FiatValue } from '../../components/FiatValue'
import { getTokenMarketCap } from '../../utils/tokens'
import { useTokenInfo } from './hook'

type TokenMarketCapCardProps = {
  address: string
  isPriceLoading: boolean
  rosePriceInUsd: number | undefined
  scope: SearchScope
}

export const TokenMarketCapCard: FC<TokenMarketCapCardProps> = ({
  address,
  isPriceLoading,
  rosePriceInUsd,
  scope,
}) => {
  const { isLoading, token } = useTokenInfo(scope, address)
  const marketCapValue = getTokenMarketCap(token?.relative_total_value, rosePriceInUsd)

  return (
    <SnapshotTextCard title={<MarketCapTitle scope={scope} />} alignWithCardsWithActions>
      {isLoading || isPriceLoading ? (
        <Skeleton variant="text" />
      ) : (
        <FiatValue isLoading={isPriceLoading} value={marketCapValue} />
      )}
    </SnapshotTextCard>
  )
}
