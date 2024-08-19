import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { Proposal } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { RoundedBalance } from '../RoundedBalance'
import { ProposalStatusIcon } from '../../components/Proposals/ProposalStatusIcon'
import { ProposalLink } from '../Proposals/ProposalLink'

type NetworkProposalsListProps = {
  proposals?: Proposal[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  verbose?: boolean
}

export const NetworkProposalsList: FC<NetworkProposalsListProps> = ({
  isLoading,
  limit,
  pagination,
  proposals,
  verbose,
}) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { align: TableCellAlign.Center, key: 'id', content: t('networkProposal.id') },
    { key: 'handler', content: t('networkProposal.handler') },
    ...(verbose ? [{ key: 'voting', content: 'Voting' }] : []),
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
        content: <ProposalLink network={proposal.network} proposalId={proposal.id} label={proposal.title} />,
        key: 'handler',
      },
      ...(verbose
        ? [
            {
              key: 'voting',
              content: (
                // TODO: add voting component when API is ready
                <>-</>
              ),
            },
          ]
        : []),
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={proposal.deposit} />,
        key: 'deposit',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <Tooltip title={t('networkProposal.createTooltip')} placement={'top'}>
            <Box>{proposal.created_at}</Box>
          </Tooltip>
        ),
        key: 'create',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <Tooltip title={t('networkProposal.closeTooltip')} placement={'top'}>
            <Box>{proposal.closes_at}</Box>
          </Tooltip>
        ),
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
