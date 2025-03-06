import { useTranslation } from 'react-i18next'
import { Block, EntityMetadata } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockHashLink, BlockLink } from './BlockLink'
import { useScreenSize } from '../../hooks/useScreensize'
import { FC } from 'react'
import { ValidatorLink } from '../Validators/ValidatorLink'
import { TableHeaderAge } from '../TableHeaderAge'
import { TableCellAge } from '../TableCellAge'

export type TableConsensusBlock = Block & {
  markAsNew?: boolean
}

export type TableConsensusBlockList = {
  blocks: TableConsensusBlock[]
  total_count: number
  is_total_count_clipped: boolean
}

type ConsensusBlocksProps = {
  blocks?: TableConsensusBlock[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  showEpoch?: boolean
  showHash?: boolean
  showProposer?: boolean
}

export const ConsensusBlocks: FC<ConsensusBlocksProps> = ({
  isLoading,
  blocks,
  pagination,
  limit,
  showEpoch = false,
  showHash = true,
  showProposer = false,
}) => {
  const { t } = useTranslation()
  const { isLaptop } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { key: 'height', content: t('common.height'), align: TableCellAlign.Left },
    ...(showHash ? [{ key: 'hash', content: t('common.hash') }] : []),
    ...(showEpoch ? [{ key: 'epoch', content: t('common.epoch') }] : []),
    {
      key: 'transaction',
      content: isLaptop ? t('common.transactionAbbreviation') : t('common.transactions'),
      align: TableCellAlign.Right,
    },
    ...(showProposer ? [{ key: 'proposer', content: t('common.proposer') }] : []),
    { key: 'age', content: <TableHeaderAge />, align: TableCellAlign.Right },
  ]

  const tableRows = blocks?.map(block => {
    return {
      key: block.hash,
      data: [
        {
          align: TableCellAlign.Left,
          content: <BlockLink scope={block} height={block.height} />,
          key: 'block',
        },
        ...(showHash
          ? [
              {
                content: <BlockHashLink scope={block} hash={block.hash} height={block.height} alwaysTrim />,
                key: 'hash',
              },
            ]
          : []),
        ...(showEpoch
          ? [
              {
                content: block.epoch.toLocaleString(),
                key: 'epoch',
              },
            ]
          : []),
        {
          align: TableCellAlign.Right,
          content: block.num_transactions.toLocaleString(),
          key: 'txs',
        },
        ...(showProposer
          ? [
              {
                content: (
                  <>
                    {block.proposer?.entity_address ? (
                      <ValidatorLink
                        name={(block.proposer?.entity_metadata as EntityMetadata)?.name}
                        address={block.proposer?.entity_address}
                        alwaysTrim
                        network={block.network}
                      />
                    ) : (
                      t('common.missing')
                    )}
                  </>
                ),
                key: 'proposer',
              },
            ]
          : []),
        {
          align: TableCellAlign.Right,
          content: <TableCellAge sinceTimestamp={block.timestamp} />,
          key: 'timestamp',
        },
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
