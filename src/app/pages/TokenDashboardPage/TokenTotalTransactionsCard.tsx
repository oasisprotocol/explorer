import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from '@mui/material/Skeleton'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { useTokenInfo } from './hook'
import { RuntimeScope } from '../../../types/searchScope'

export const TokenTotalTransactionsCard: FC<{ scope: RuntimeScope; address: string }> = ({
  scope,
  address,
}) => {
  const { t } = useTranslation()
  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotTextCard title={t('common.transfers')} alignWithCardsWithActions>
      {isLoading ? (
        <Skeleton variant="text" />
      ) : (
        isFetched && (
          <>
            {typeof token?.num_transfers === 'number'
              ? t('common.valuePair', { value: token.num_transfers })
              : t('common.missing')}
          </>
        )
      )}
    </SnapshotTextCard>
  )
}
