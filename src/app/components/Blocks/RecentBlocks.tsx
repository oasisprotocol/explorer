import { FC } from 'react'
import { Link as RouterLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { RecentBlock } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { getLayerLabels } from '../../utils/content'
import { RouteUtils } from '../../utils/route-utils'
import { Table, TableColProps } from '../Table'
import { TableCellAlign } from '../Table/types'
import { TableCellAge } from '../TableCellAge'
import { TableHeaderAge } from '../TableHeaderAge'
import { BlockHashLink, BlockLink } from './BlockLink'

export type TableBlockList = {
  blocks: RecentBlock[]
  total_count: number
  is_total_count_clipped: boolean
}

type RecentBlocksProps = {
  blocks?: RecentBlock[]
  isLoading: boolean
  limit: number
}

export const RecentBlocks: FC<RecentBlocksProps> = ({ isLoading, blocks, limit }) => {
  const { t } = useTranslation()
  const { isLaptop } = useScreenSize()
  const layerLabels = getLayerLabels(t)
  const tableColumns: TableColProps[] = [
    { key: 'chain', content: t('common.chain') },
    { key: 'block', content: t('common.block') },
    {
      key: 'hash',
      content: t('common.hash'),
    },
    { key: 'age', content: <TableHeaderAge />, align: TableCellAlign.Right },
    {
      key: 'transaction',
      content: isLaptop ? t('common.transactionAbbreviation') : t('common.transactions'),
      align: TableCellAlign.Right,
    },
  ]

  const tableRows = blocks?.map(block => {
    return {
      key: block.hash,
      data: [
        {
          content: (
            <Link asChild className="font-medium">
              <RouterLink to={RouteUtils.getDashboardRoute({ layer: block.layer, network: block.network })}>
                {layerLabels[block.layer]}
              </RouterLink>
            </Link>
          ),
          key: 'layer',
        },

        {
          content: <BlockLink scope={{ network: block.network, layer: block.layer }} height={block.height} />,
          key: 'block',
        },
        {
          content: (
            <BlockHashLink
              scope={{ network: block.network, layer: block.layer }}
              hash={block.hash}
              height={block.height}
              alwaysTrim
            />
          ),
          key: 'hash',
        },
        {
          align: TableCellAlign.Right,
          content: <TableCellAge sinceTimestamp={block.timestamp} />,
          key: 'timestamp',
        },
        {
          align: TableCellAlign.Right,
          content: block.num_transactions.toLocaleString(),
          key: 'txs',
        },
      ],
    }
  })

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('blocks.latest')}
      isLoading={isLoading}
      pagination={false}
    />
  )
}
