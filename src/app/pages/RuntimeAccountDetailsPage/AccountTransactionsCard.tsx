import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeTransactions } from '../../components/Transactions'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useAccountTransactions } from './hook'
import { RuntimeAccountDetailsContext } from './index'

export const accountTransactionsContainerId = 'transactions'

export const AccountTransactionsCard: FC<RuntimeAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <LinkableCardLayout
      containerId={accountTransactionsContainerId}
      title={t('account.transactionsListTitle')}
    >
      <AccountTransactions scope={scope} address={address} />
    </LinkableCardLayout>
  )
}

const AccountTransactions: FC<RuntimeAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading, isFetched, transactions, pagination, totalCount, isTotalCountClipped } =
    useAccountTransactions(scope, address)
  return (
    <>
      {isFetched && !transactions?.length && <CardEmptyState label={t('account.emptyTransactionList')} />}
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
      />
    </>
  )
}
