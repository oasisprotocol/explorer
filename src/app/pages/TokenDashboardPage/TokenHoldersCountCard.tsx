import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from '@mui/material/Skeleton'
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
        <Skeleton variant="text" />
      ) : (
        isFetched && <>{t('tokens.holdersValue', { value: token?.num_holders })}</>
      )}
    </SnapshotTextCard>
  )
}
