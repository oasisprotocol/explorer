import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDistanceStrict } from 'date-fns'
import Box from '@mui/material/Box'
import { RuntimeTransaction } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { TransactionLink } from '../../components/Transactions/TransactionLink'

type LastActivityProps = {
  transaction: RuntimeTransaction | undefined
  scope: SearchScope
}

export const LastActivity: FC<LastActivityProps> = ({ scope, transaction }) => {
  const { t } = useTranslation()

  return (
    <>
      {transaction ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <TransactionLink scope={scope} hash={transaction.eth_hash ?? transaction.hash} />(
          {formatDistanceStrict(transaction.timestamp, new Date(), {
            addSuffix: true,
          })}
          )
        </Box>
      ) : (
        t('common.missing')
      )}
    </>
  )
}
