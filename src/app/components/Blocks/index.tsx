import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { RuntimeBlock } from '../../../oasis-indexer/api'
import { VerticalProgressBar } from '../../components/ProgressBar'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TrimLinkLabel } from '../../components/TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import { ParaTime } from '../../../config'
import { TablePaginationProps } from '../Table/TablePagination'

export type TableRuntimeBlock = RuntimeBlock & {
  markAsNew?: boolean
}

export type TableRuntimeBlockList = {
  blocks: TableRuntimeBlock[]
}

type BlocksProps = {
  blocks?: TableRuntimeBlock[]
  isLoading: boolean
  limit: number
  verbose?: boolean
  pagination: false | TablePaginationProps
}

const gasLimit = 10000000 // TODO temporary value, 22020096 for consensus

export const Blocks = (props: BlocksProps) => {
  const { isLoading, blocks, verbose, pagination, limit } = props
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { content: t('common.fill') },
    { content: t('common.block'), align: TableCellAlign.Right },
    { content: t('common.age'), align: TableCellAlign.Right },
    { content: t('common.transactions'), align: TableCellAlign.Right },
    ...(verbose ? [{ content: t('common.hash') }] : []),
    { content: t('common.size'), align: TableCellAlign.Right },
    ...(verbose ? [{ content: t('common.gasUsed'), align: TableCellAlign.Right }] : []),
  ]

  const tableRows = blocks?.map(block => ({
    key: block.hash,
    data: [
      {
        content: <VerticalProgressBar variant="determinate" value={(100 * block.gas_used) / gasLimit} />,
        key: 'fill',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <Link component={RouterLink} to={RouteUtils.getBlockRoute(block.round, ParaTime.Emerald)}>
            {block.round}
          </Link>
        ),
        key: 'block',
      },
      {
        align: TableCellAlign.Right,
        content: formatDistanceStrict(new Date(block.timestamp), new Date(), {
          addSuffix: true,
        }),
        key: 'timestamp',
      },
      {
        align: TableCellAlign.Right,
        content: block.num_transactions,
        key: 'txs',
      },
      ...(verbose
        ? [
            {
              content: <TrimLinkLabel label={block.hash} to={block.hash} />, // TODO: do we want linking to blocks by hash?
              // If yes, what should be the URL scheme for that?
              key: 'hash',
            },
          ]
        : []),
      {
        align: TableCellAlign.Right,
        content: t('common.bytes', {
          value: block.size,
          formatParams: {
            value: {
              style: 'unit',
              unit: 'byte',
              unitDisplay: 'long',
            },
          },
        }),
        key: 'size',
      },
      ...(verbose
        ? [
            {
              align: TableCellAlign.Right,
              content: block.gas_used,
              key: 'gasUsed',
            },
          ]
        : []),
    ],
    markAsNew: block.markAsNew,
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
