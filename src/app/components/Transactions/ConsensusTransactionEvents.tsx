import { FC } from 'react'
import { Transaction } from '../../../oasis-nexus/api'
import { ConsensusEventsList } from '../ConsensusEvents/ConsensusEventsList'

export const ConsensusTransactionEvents: FC<{
  transaction: Transaction
}> = () => {
  return <ConsensusEventsList />
}
