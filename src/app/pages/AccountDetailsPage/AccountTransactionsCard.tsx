import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Transactions } from '../../components/Transactions'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from './CardEmptyState'
import { useAccountTransactions } from './hook'
import { AccountDetailsContext } from './index'

export const accountTransactionsContainerId = 'transactions'

export const AccountTransactionsCard: FC<AccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={accountTransactionsContainerId}>
        <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <AccountTransactions scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const AccountTransactions: FC<AccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading, isFetched, transactions, pagination, totalCount, isTotalCountClipped } =
    useAccountTransactions(scope, address)
  return (
    <>
      {isFetched && !transactions?.length && <CardEmptyState label={t('account.emptyTransactionList')} />}
      <Transactions
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
