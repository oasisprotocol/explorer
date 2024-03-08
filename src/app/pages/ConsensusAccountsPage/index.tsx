import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useGetConsensusAccounts } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as PAGE_SIZE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { VerticalList } from '../../components/VerticalList'
import { AccountList } from 'app/components/AccountList'
import { ConsensusAccountDetailsView } from '../ConsensusAccountDetailsPage'

export const ConsensusAccountsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
  const { network } = scope

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const accountsQuery = useGetConsensusAccounts(network, {
    limit: tableView === TableLayout.Vertical ? offset + PAGE_SIZE : PAGE_SIZE,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = accountsQuery
  const accountsData = data?.data
  if (isFetched && offset && !accountsData?.accounts?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical && <LoadMoreButton pagination={pagination} isLoading={isLoading} />
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={
          <CardHeaderWithCounter
            changeMobileColors
            label={t('account.listTitle')}
            totalCount={accountsData?.total_count}
            isTotalCountClipped={accountsData?.is_total_count_clipped}
          />
        }
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
      >
        {tableView === TableLayout.Horizontal && (
          <AccountList
            accounts={accountsData?.accounts}
            isLoading={isLoading}
            limit={PAGE_SIZE}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: accountsData?.total_count,
              isTotalCountClipped: accountsData?.is_total_count_clipped,
              rowsPerPage: PAGE_SIZE,
            }}
            verbose
          />
        )}
        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(PAGE_SIZE).keys()].map(key => (
                <ConsensusAccountDetailsView key={key} isLoading={true} account={undefined} standalone />
              ))}
            {!isLoading &&
              accountsData?.accounts.map(account => (
                <ConsensusAccountDetailsView key={account.address} account={account} standalone />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
