import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

import { RuntimeBlockList } from '../../../oasis-indexer/generated/api'
import { VerticalProgressBar } from '../../components/ProgressBar'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { trimLongString } from '../../utils/trimLongString'
import { intlDateFormat } from '../../utils/dateFormatter'
import { emeraldRoute } from '../../../routes'

type BlocksProps = RuntimeBlockList & {
  isLoading: boolean
  limit: number
  verbose?: boolean
  pagination?: boolean
}

const gasLimit = 10000000 // TODO temporary value, 22020096 for consensus

export const Blocks = (props: BlocksProps) => {
  const { isLoading, blocks, verbose, pagination, limit } = props
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { content: t('common.table.fill') },
    { content: t('common.table.block'), align: TableCellAlign.Right },
    ...(verbose ? [{ content: t('common.table.timestamp') }] : []),
    ...(verbose ? [{ content: t('common.table.height') }] : []),
    ...(verbose ? [{ content: t('common.table.hash') }] : []),
    { content: t('common.table.age'), align: TableCellAlign.Right },
    { content: t('common.table.txs'), align: TableCellAlign.Right },
    ...(verbose ? [{ content: t('common.table.gasUsed') }] : []),
    { content: t('common.table.size'), align: TableCellAlign.Right },
    ...(verbose ? [{ content: t('common.table.totalSent') }] : []),
  ]

  const tableRows = blocks?.map(block => ({
    key: block.hash!,
    data: [
      {
        content: <VerticalProgressBar variant="determinate" value={(100 * block.gas_used!) / gasLimit} />,
        key: 'fill',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <Link component={RouterLink} to={`${emeraldRoute}/blocks/${encodeURIComponent(block.round!)}`}>
            {block.round}
          </Link>
        ),
        key: 'block',
      },
      ...(verbose
        ? [
            {
              content: intlDateFormat(new Date(block.timestamp!)),
              key: 'timestamp',
            },
          ]
        : []),
      ...(verbose
        ? [
            {
              content: 1234, // TODO: how do I get block height?
              key: 'height',
            },
          ]
        : []),
      ...(verbose
        ? [
            {
              content: (
                <Link component={RouterLink} to={block.hash!}>
                  {trimLongString(block.hash!, 4, 4, '-')}
                </Link>
              ), // TODO: do we want linking to blocks by hash?
              // If yes, what should be the URL scheme for that?
              key: 'hash',
            },
          ]
        : []),
      {
        align: TableCellAlign.Right,
        content: formatDistanceStrict(new Date(block.timestamp!), new Date(), {
          addSuffix: true,
        }),
        key: 'age',
      },
      {
        align: TableCellAlign.Right,
        content: block.num_transactions,
        key: 'txs',
      },
      ...(verbose
        ? [
            {
              content: block.gas_used,
              key: 'gasUsed',
            },
          ]
        : []),
      {
        align: TableCellAlign.Right,
        content: t('common.table.bytes', { value: block.size_bytes }),
        key: 'size',
      },
      ...(verbose
        ? [
            {
              content: '100 ROSE', // TODO: how do I get total sent?
              key: 'totalSent',
            },
          ]
        : []),
    ],
  }))

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('blocks.latest')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
