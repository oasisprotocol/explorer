import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsensusEvent } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { TransactionLink } from '../Transactions/TransactionLink'

const ConsensusEventDetailsContent: FC<{
  event: ConsensusEvent
}> = ({ event }) => {
  // TODO: Handle specific event types. Implement new UI or re-use layout used in runtimes
  return (
    <div>
      <b>{event.type}</b>
      <br />
      <pre>{JSON.stringify(event, null, ' ')}</pre>
    </div>
  )
}

export const ConsensusEventDetails: FC<{
  scope: SearchScope
  event: ConsensusEvent
  showTxHash: boolean
}> = ({ scope, event, showTxHash }) => {
  const { t } = useTranslation()
  return (
    <div>
      <ConsensusEventDetailsContent event={event} />
      {showTxHash && event.tx_hash && (
        <p>
          {t('event.fields.emittingTransaction')}:{' '}
          <TransactionLink scope={scope} alwaysTrim hash={event.tx_hash} />
        </p>
      )}
    </div>
  )
}
