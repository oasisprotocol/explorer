import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDistanceToNow } from '../../utils/dateFormatter'
import { RuntimeTransaction } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { TransactionLink } from '../../components/Transactions/TransactionLink'
import { useScreenSize } from '../../hooks/useScreensize'

type LastActivityProps = {
  transaction: RuntimeTransaction | undefined
  scope: SearchScope
}

export const LastActivity: FC<LastActivityProps> = ({ scope, transaction }) => {
  const { t } = useTranslation()
  const { isTablet } = useScreenSize()

  return (
    <>
      {transaction ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <TransactionLink
            scope={scope}
            hash={transaction.eth_hash ?? transaction.hash}
            alwaysTrim={isTablet}
          />
          <span>
            (
            {formatDistanceToNow(new Date(transaction.timestamp), {
              keepSuffix: true,
              style: 'long',
            })}
            )
          </span>
        </div>
      ) : (
        t('common.missing')
      )}
    </>
  )
}
