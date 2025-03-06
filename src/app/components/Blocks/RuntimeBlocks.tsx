import { useTranslation } from 'react-i18next'
import { RuntimeBlock } from '../../../oasis-nexus/api'
import { VerticalProgressBar } from '../../components/ProgressBar'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { paraTimesConfig } from '../../../config'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockHashLink, BlockLink } from './BlockLink'
import { useScreenSize } from '../../hooks/useScreensize'
import { FC } from 'react'
import { BlocksTableType } from './index'
import { TableHeaderAge } from '../TableHeaderAge'
import { TableCellAge } from '../TableCellAge'

export type TableRuntimeBlock = RuntimeBlock & {
  markAsNew?: boolean
}

export type TableRuntimeBlockList = {
  blocks: TableRuntimeBlock[]
  total_count: number
  is_total_count_clipped: boolean
}

type RuntimeBlocksProps = {
  blocks?: TableRuntimeBlock[]
  isLoading: boolean
  limit: number
  type?: BlocksTableType
  pagination: false | TablePaginationProps
}

export const RuntimeBlocks: FC<RuntimeBlocksProps> = ({
  isLoading,
  blocks,
  type = BlocksTableType.Desktop,
  pagination,
  limit,
}) => {
  const { t } = useTranslation()
  const { isLaptop } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { key: 'fill', content: t('common.fill') },
    { key: 'height', content: t('common.height'), align: TableCellAlign.Right },
    { key: 'age', content: <TableHeaderAge />, align: TableCellAlign.Right },
    ...(type === BlocksTableType.Desktop || type === BlocksTableType.DesktopLite
      ? [
          {
            key: 'transaction',
            content: isLaptop ? t('common.transactionAbbreviation') : t('common.transactions'),
            align: TableCellAlign.Right,
          },
        ]
      : []),
    ...(type === BlocksTableType.Desktop ? [{ key: 'hash', content: t('common.hash') }] : []),
    { key: 'size', content: t('common.size'), align: TableCellAlign.Right },
    ...(type === BlocksTableType.Desktop
      ? [{ key: 'gasUsed', content: t('common.gasUsed'), align: TableCellAlign.Right }]
      : []),
    ...(type === BlocksTableType.Desktop
      ? [{ key: 'gasLimit', content: t('common.gasLimit'), align: TableCellAlign.Right }]
      : []),
  ]

  const tableRows = blocks?.map(block => {
    const blockGasLimit = paraTimesConfig[block.layer]?.[block.network]?.blockGasLimit
    if (!blockGasLimit) throw new Error('blockGasLimit is not configured')
    return {
      key: block.hash,
      data: [
        {
          content: <VerticalProgressBar value={(100 * block.gas_used) / blockGasLimit} />,
          key: 'fill',
        },
        {
          align: TableCellAlign.Right,
          content: <BlockLink scope={block} height={block.round} />,
          key: 'block',
        },
        {
          align: TableCellAlign.Right,
          content: <TableCellAge sinceTimestamp={block.timestamp} />,
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
                content: <BlockHashLink scope={block} hash={block.hash} height={block.round} alwaysTrim />,
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
    />
  )
}
