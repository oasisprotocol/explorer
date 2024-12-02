import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { useTokenInfo } from './hook'
import Skeleton from '@mui/material/Skeleton'
import { SearchScope } from '../../../types/searchScope'
import { RoundedBalance } from '../../components/RoundedBalance'

export const TokenSupplyCard: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotTextCard
      title={t('tokens.totalSupply')}
      label={isLoading ? <Skeleton variant="text" sx={{ width: '4em' }} /> : token?.symbol}
    >
      {isLoading ? (
        <Skeleton variant="text" />
      ) : (
        isFetched &&
        token && (
          <>
            {token.total_supply ? (
              <RoundedBalance value={token.total_supply} compactLargeNumbers />
            ) : (
              t('common.not_defined')
            )}
          </>
        )
      )}
    </SnapshotTextCard>
  )
}
