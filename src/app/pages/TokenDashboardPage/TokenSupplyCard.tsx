import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { useTokenInfo } from './hooks'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { RuntimeScope } from '../../../types/searchScope'
import { RoundedBalance } from '../../components/RoundedBalance'

export const TokenSupplyCard: FC<{ scope: RuntimeScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotTextCard
      title={t('tokens.totalSupply')}
      label={isLoading ? <Skeleton className="h-4 w-[4em]" /> : token?.symbol}
    >
      {isLoading ? (
        <Skeleton className="h-4" />
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
