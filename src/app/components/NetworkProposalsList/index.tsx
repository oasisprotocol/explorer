import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { Proposal } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { RoundedBalance } from '../RoundedBalance'
import { ProposalStatusIcon } from '../../components/ProposalStatusIcon'

type NetworkProposalsListProps = {
  proposals?: Proposal[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const NetworkProposalsList: FC<NetworkProposalsListProps> = ({
  isLoading,
  limit,
  pagination,
  proposals,
}) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { align: TableCellAlign.Center, key: 'id', content: t('networkProposal.id') },
    { key: 'handler', content: t('networkProposal.handler') },
    { align: TableCellAlign.Right, key: 'deposit', content: t('networkProposal.deposit') },
    { align: TableCellAlign.Right, key: 'create', content: t('networkProposal.create') },
    { align: TableCellAlign.Right, key: 'close', content: t('networkProposal.close') },
    { align: TableCellAlign.Right, key: 'state', content: t('common.status') },
  ]
  const tableRows = proposals?.map(proposal => ({
    key: proposal.id.toString(),
    data: [
      {
        align: TableCellAlign.Center,
        content: <>{proposal.id}</>,
        key: 'id',
      },
      {
        align: TableCellAlign.Left,
        // TODO: link to Proposals page once it is ready
        content: <>{proposal.handler}</>,
        key: 'handler',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={proposal.deposit} />,
        key: 'deposit',
      },
      {
        align: TableCellAlign.Right,
        content: <>{proposal.created_at}</>,
        key: 'create',
      },
      {
        align: TableCellAlign.Right,
        content: <>{proposal.closes_at}</>,
        key: 'close',
      },
      {
        align: TableCellAlign.Right,
        content: <ProposalStatusIcon status={proposal.state} />,
        key: 'state',
      },
    ],
  }))

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('networkProposal.listTitle')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
