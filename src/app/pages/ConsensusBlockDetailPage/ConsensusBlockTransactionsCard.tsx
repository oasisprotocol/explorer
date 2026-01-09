import { FC } from 'react'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusTransactions } from '../../components/Transactions'
import { AppErrors } from '../../../types/errors'
import { SearchScope } from '../../../types/searchScope'
import { ConsensusBlockDetailsContext } from './types'
import { LinkableCardLayout } from 'app/components/LinkableCardLayout'
import { useConsensusTxMethodParam } from '../../hooks/useCommonParams'
import { ConsensusTransactionMethodFilter } from '../../components/Transactions/ConsensusTransactionMethodFilter'
import { useScreenSize } from '../../hooks/useScreensize'
import {
  getConsensusTransactionMethodFilteringParam,
  ConsensusTxMethodFilterOption,
} from '../../components/ConsensusTransactionMethod'
import { transactionsContainerId } from '../../utils/tabAnchors'

const TransactionList: FC<{
  scope: SearchScope
  blockHeight: number
  method: ConsensusTxMethodFilterOption
}> = ({ scope, blockHeight, method }) => {
  const txsPagination = useSearchParamsPagination('page')
  const txsOffset = (txsPagination.selectedPage - 1) * NUMBER_OF_ITEMS_ON_SEPARATE_PAGE
  const transactionsQuery = useGetConsensusTransactions(scope.network, {
    block: blockHeight,
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    offset: txsOffset,
    ...getConsensusTransactionMethodFilteringParam(method),
  })
  const { isLoading, isFetched, data } = transactionsQuery
  const transactions = data?.data.transactions

  if (isFetched && txsPagination.selectedPage > 1 && !transactions?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <ConsensusTransactions
      transactions={transactions}
      isLoading={isLoading}
      limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
      pagination={{
        selectedPage: txsPagination.selectedPage,
        linkToPage: txsPagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      }}
      filtered={method !== 'any'}
    />
  )
}

export const ConsensusBlockTransactionsCard: FC<ConsensusBlockDetailsContext> = ({ scope, blockHeight }) => {
  const { txMethod, setTxMethod } = useConsensusTxMethodParam()
  const { isMobile } = useScreenSize()

  if (!blockHeight) {
    return null
  }

  return (
    <LinkableCardLayout
      containerId={transactionsContainerId}
      title={
        <div className="flex justify-end">
          {!isMobile && <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} />}
        </div>
      }
    >
      {isMobile && <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} expand />}
      <TransactionList scope={scope} blockHeight={blockHeight} method={txMethod} />
    </LinkableCardLayout>
  )
}
