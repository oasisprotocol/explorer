import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { useAccount } from '../RuntimeAccountDetailsPage/hook'
import { RuntimeScope } from '../../../types/searchScope'

export const TokenGasUsedCard: FC<{ scope: RuntimeScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { account, isFetched } = useAccount(scope, address)

  return (
    <SnapshotCard title={t('common.gasUsed')} alignWithCardsWithActions>
      <div className="flex items-center justify-center h-full">
        {isFetched && (
          <>
            <span className="text-2xl font-semibold text-primary">
              {
                // TODO: return "gas used" here, when it becomes available
                account?.stats.num_txns
              }
            </span>
          </>
        )}
      </div>
    </SnapshotCard>
  )
}
