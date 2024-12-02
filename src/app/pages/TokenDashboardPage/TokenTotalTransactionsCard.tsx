import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from '@mui/material/Skeleton'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { useTokenInfo } from './hook'
import { SearchScope } from '../../../types/searchScope'

export const TokenTotalTransactionsCard: FC<{ scope: SearchScope; address: string }> = ({
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
        isFetched && <>{t('common.valuePair', { value: token?.num_transfers })}</>
      )}
    </SnapshotTextCard>
  )
}
