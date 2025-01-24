import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useAccountTransactions } from './hook'
import { RuntimeAccountDetailsContext } from './index'
import { useScreenSize } from '../../hooks/useScreensize'
import { RuntimeTransactionTypeFilter } from '../../components/Transactions/RuntimeTransactionTypeFilter'
import Box from '@mui/material/Box'

export const accountTransactionsContainerId = 'transactions'

export const AccountTransactionsCard: FC<RuntimeAccountDetailsContext> = context => {
  const { method, setMethod } = context

  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  return (
    <LinkableCardLayout
      containerId={accountTransactionsContainerId}
      title={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {t('account.transactionsListTitle')}
          {!isMobile && <RuntimeTransactionTypeFilter value={method} setValue={setMethod} />}
        </Box>
      }
    >
      {isMobile && <RuntimeTransactionTypeFilter value={method} setValue={setMethod} expand />}
      <AccountTransactions {...context} />
    </LinkableCardLayout>
  )
}

const AccountTransactions: FC<RuntimeAccountDetailsContext> = ({ scope, address, method }) => {
  const { isLoading, transactions, pagination, totalCount, isTotalCountClipped } = useAccountTransactions(
    scope,
    address,
    method,
  )
  return (
    <RuntimeTransactions
      transactions={transactions}
      ownAddress={address}
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
