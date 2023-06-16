import { useTranslation } from 'react-i18next'
import { RuntimeBlock } from '../../../oasis-indexer/api'
import { VerticalProgressBar } from '../../components/ProgressBar'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { paraTimesConfig } from '../../../config'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockHashLink, BlockLink } from './BlockLink'
import { formatDistanceToNow } from '../../utils/dateFormatter'
import { useScreenSize } from '../../hooks/useScreensize'
import { FC } from 'react'

export type TableRuntimeBlock = RuntimeBlock & {
  markAsNew?: boolean
}

export type TableRuntimeBlockList = {
  blocks: TableRuntimeBlock[]
  total_count: number
  is_total_count_clipped: boolean
}

export enum BlocksTableType {
  Mobile,
  DesktopLite,
  Desktop,
}

type BlocksProps = {
  blocks?: TableRuntimeBlock[]
  isLoading: boolean
  limit: number
  type?: BlocksTableType
  pagination: false | TablePaginationProps
}

export const Blocks: FC<BlocksProps> = ({
  isLoading,
  blocks,
  type = BlocksTableType.Desktop,
  pagination,
  limit,
}) => {
  const { t } = useTranslation()
  const { isLaptop } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { content: t('common.fill') },
    { content: t('common.height'), align: TableCellAlign.Right },
    { content: t('common.age'), align: TableCellAlign.Right },
    ...(type === BlocksTableType.Desktop || type === BlocksTableType.DesktopLite
      ? [
          {
            content: isLaptop ? t('common.transactionAbbreviation') : t('common.transactions'),
            align: TableCellAlign.Right,
          },
        ]
      : []),
    ...(type === BlocksTableType.Desktop ? [{ content: t('common.hash') }] : []),
    { content: t('common.size'), align: TableCellAlign.Right },
    ...(type === BlocksTableType.Desktop
      ? [{ content: t('common.gasUsed'), align: TableCellAlign.Right }]
      : []),
    ...(type === BlocksTableType.Desktop
      ? [{ content: t('common.gasLimit'), align: TableCellAlign.Right }]
      : []),
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
          content: formatDistanceToNow(
            new Date(block.timestamp),
            type === BlocksTableType.Mobile || type === BlocksTableType.DesktopLite,
          ),
          key: 'timestamp',
        },
        ...(type === BlocksTableType.Desktop || type === BlocksTableType.DesktopLite
          ? [
              {
                align: TableCellAlign.Right,
                content: block.num_transactions.toLocaleString(),
                key: 'txs',
              },
            ]
          : []),
        ...(type === BlocksTableType.Desktop
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
        ...(type === BlocksTableType.Desktop
          ? [
              {
                align: TableCellAlign.Right,
                content: block.gas_used.toLocaleString(),
                key: 'gasUsed',
              },
            ]
          : []),
        ...(type === BlocksTableType.Desktop
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
      verbose={type === BlocksTableType.Desktop}
    />
  )
}
