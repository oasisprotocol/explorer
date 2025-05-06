import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useGetConsensusProposals } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as PAGE_SIZE } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { NetworkProposalsList } from '../../components/NetworkProposalsList'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { VerticalList } from '../../components/VerticalList'
import { ProposalDetailView } from '../ProposalDetailsPage'

export const ProposalsPage: FC = () => {
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

  const proposalsQuery = useGetConsensusProposals(network, {
    limit: tableView === TableLayout.Vertical ? offset + PAGE_SIZE : PAGE_SIZE,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = proposalsQuery
  const proposalsData = data?.data
  if (isFetched && offset && !proposalsData?.proposals?.length) {
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
            label={t('networkProposal.listTitle')}
            totalCount={proposalsData?.total_count}
            isTotalCountClipped={proposalsData?.is_total_count_clipped}
          />
        }
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <NetworkProposalsList
            proposals={proposalsData?.proposals}
            isLoading={proposalsQuery.isLoading}
            limit={PAGE_SIZE}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: data?.data.total_count,
              isTotalCountClipped: data?.data.is_total_count_clipped,
              rowsPerPage: PAGE_SIZE,
            }}
            verbose
          />
        )}
        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(PAGE_SIZE).keys()].map(key => (
                <ProposalDetailView key={key} isLoading={true} proposal={undefined} standalone />
              ))}
            {!isLoading &&
              proposalsData?.proposals.map(proposal => (
                <ProposalDetailView key={proposal.handler} proposal={proposal} standalone />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
