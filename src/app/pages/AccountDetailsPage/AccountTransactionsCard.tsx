import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Transactions } from '../../components/Transactions'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ScrollingDiv } from '../../components/PageLayout/ScrollingDiv'
import { CardEmptyState } from './CardEmptyState'
import { useAccountTransactions } from './hook'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'

export const accountTransactionsContainerId = 'transactions'

export const AccountTransactionsCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string

  const { isLoading, isFetched, transactions, pagination, totalCount, isTotalCountClipped } =
    useAccountTransactions(scope, address)
  return (
    <Card>
      <ScrollingDiv id={accountTransactionsContainerId}>
        <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
      </ScrollingDiv>
      <CardContent>
        <ErrorBoundary light={true}>
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
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
