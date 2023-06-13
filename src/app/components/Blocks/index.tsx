import { useTranslation } from 'react-i18next'
import { RuntimeBlock } from '../../../oasis-indexer/api'
import { VerticalProgressBar } from '../../components/ProgressBar'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { paraTimesConfig } from '../../../config'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockHashLink, BlockLink } from './BlockLink'
import { formatDistanceStrict } from '../../utils/dateFormatter'
import { useScreenSize } from '../../hooks/useScreensize'

export type TableRuntimeBlock = RuntimeBlock & {
  markAsNew?: boolean
}

export type TableRuntimeBlockList = {
  blocks: TableRuntimeBlock[]
  total_count: number
  is_total_count_clipped: boolean
}

type BlocksProps = {
  blocks?: TableRuntimeBlock[]
  isLoading: boolean
  limit: number
  verbose?: boolean
  pagination: false | TablePaginationProps
}

export const Blocks = (props: BlocksProps) => {
  const { isLoading, blocks, verbose, pagination, limit } = props
  const { t } = useTranslation()
  const { isLaptop } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { content: t('common.fill') },
    { content: t('common.height'), align: TableCellAlign.Right },
    { content: t('common.age'), align: TableCellAlign.Right },
    ...(verbose ? [{
      content: isLaptop ? t('common.transactionAbbreviation') : t('common.transactions'),
      align: TableCellAlign.Right,
    }] : []),
    ...(verbose ? [{ content: t('common.hash') }] : []),
    { content: t('common.size'), align: TableCellAlign.Right },
    ...(verbose ? [{ content: t('common.gasUsed'), align: TableCellAlign.Right }] : []),
    ...(verbose ? [{ content: t('common.gasLimit'), align: TableCellAlign.Right }] : []),
  ]

  const tableRows = blocks?.map(block => {
    const blockGasLimit = paraTimesConfig[block.layer]?.mainnet.blockGasLimit
    if (!blockGasLimit) throw new Error('blockGasLimit is not configured')
    return {
      key: block.hash,
      data: [
        {
          content: (
            <VerticalProgressBar variant="determinate" value={(100 * block.gas_used) / blockGasLimit} />
          ),
          key: 'fill',
        },
        {
          align: TableCellAlign.Right,
          content: <BlockLink scope={block} height={block.round} />,
          key: 'block',
        },
        {
          align: TableCellAlign.Right,
          content: formatDistanceStrict(new Date(block.timestamp), new Date()),
          key: 'timestamp',
        },
        ...(verbose
          ? [
              {
                align: TableCellAlign.Right,
                content: block.num_transactions.toLocaleString(),
                key: 'txs',
              },
            ]
          : []),
        ...(verbose
          ? [
              {
                content: <BlockHashLink scope={block} hash={block.hash} height={block.round} />,
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
              } satisfies Intl.NumberFormatOptions,
            },
          }),
          key: 'size',
        },
        ...(verbose
          ? [
              {
                align: TableCellAlign.Right,
                content: block.gas_used.toLocaleString(),
                key: 'gasUsed',
              },
            ]
          : []),
        ...(verbose
          ? [
              {
                align: TableCellAlign.Right,
                content: blockGasLimit.toLocaleString(),
                key: 'gasLimit',
              },
            ]
          : []),
      ],
      highlight: block.markAsNew,
    }
  })

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('blocks.latest')}
      isLoading={isLoading}
      pagination={pagination}
      verbose={verbose}
    />
  )
}
