import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { updatesContainerId } from '../../utils/tabAnchors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions/RuntimeTransactions'
import { RuntimeTransactionMethodFilter } from '../../components/Transactions/RuntimeTransactionMethodFilter'
import { getRuntimeRoflUpdatesMethodOptions } from '../../components/RuntimeTransactionMethod'
import { RoflAppDetailsContext, useRoflAppUpdates } from './hooks'

export const RoflAppUpdatesCard: FC<RoflAppDetailsContext> = context => {
  const { t } = useTranslation()
  const { txMethod, setTxMethod, scope } = context
  const { isMobile } = useScreenSize()
  const customOptions = getRuntimeRoflUpdatesMethodOptions(t)

  return (
    <LinkableCardLayout
      containerId={updatesContainerId}
      title={
        <div className="flex justify-end">
          {!isMobile && (
            <RuntimeTransactionMethodFilter
              layer={scope.layer}
              value={txMethod}
              setValue={setTxMethod}
              customOptions={customOptions}
            />
          )}
        </div>
      }
    >
      {isMobile && (
        <RuntimeTransactionMethodFilter
          layer={scope.layer}
          value={txMethod}
          setValue={setTxMethod}
          expand
          customOptions={customOptions}
        />
      )}
      <RoflAppUpdates {...context} />
    </LinkableCardLayout>
  )
}

const RoflAppUpdates: FC<RoflAppDetailsContext> = ({ scope, id, txMethod }) => {
  const { isLoading, transactions, pagination, totalCount, isTotalCountClipped } = useRoflAppUpdates(
    scope,
    id,
    txMethod,
  )
  return (
    <RuntimeTransactions
      transactions={transactions}
      isLoading={isLoading}
      limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount,
        isTotalCountClipped,
        rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
      }}
      filtered={txMethod !== 'any'}
    />
  )
}
