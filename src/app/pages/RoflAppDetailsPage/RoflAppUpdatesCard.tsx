import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { updatesContainerId } from '../../utils/tabAnchors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions'
import { RuntimeTransactionTypeFilter } from '../../components/Transactions/RuntimeTransactionTypeFilter'
import { getRuntimeRoflUpdatesMethodOptions } from '../..//components/RuntimeTransactionMethod'
import { RoflAppDetailsContext, useRoflAppUpdates } from './hooks'

export const RoflAppUpdatesCard: FC<RoflAppDetailsContext> = context => {
  const { t } = useTranslation()
  const { method, setMethod, scope } = context
  const { isMobile } = useScreenSize()
  const customOptions = getRuntimeRoflUpdatesMethodOptions(t)

  return (
    <LinkableCardLayout
      containerId={updatesContainerId}
      title={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {!isMobile && (
            <RuntimeTransactionTypeFilter
              layer={scope.layer}
              value={method}
              setValue={setMethod}
              customOptions={customOptions}
            />
          )}
        </Box>
      }
    >
      {isMobile && (
        <RuntimeTransactionTypeFilter
          layer={scope.layer}
          value={method}
          setValue={setMethod}
          expand
          customOptions={customOptions}
        />
      )}
      <RoflAppUpdates {...context} />
    </LinkableCardLayout>
  )
}

const RoflAppUpdates: FC<RoflAppDetailsContext> = ({ scope, id, method }) => {
  const { isLoading, transactions, pagination, totalCount, isTotalCountClipped } = useRoflAppUpdates(
    scope,
    id,
    method,
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
      filtered={method !== 'any'}
    />
  )
}
