import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { RuntimeScope } from '../../../types/searchScope'
import { useTokenInfo } from './hook'

export const TokenHoldersCountCard: FC<{ scope: RuntimeScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { isLoading, token, isFetched } = useTokenInfo(scope, address)
  const title = t('tokens.holders')

  return (
    <SnapshotTextCard title={title} alignWithCardsWithActions>
      {isLoading ? (
        <Skeleton className="h-4" />
      ) : (
        isFetched && (
          <>
            {typeof token?.num_holders === 'number'
              ? t('tokens.holdersValue', { value: token.num_holders })
              : t('common.missing')}
          </>
        )
      )}
    </SnapshotTextCard>
  )
}
