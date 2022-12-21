import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import { Table, TableCellAlign } from '../../components/Table'
import { VerticalProgressBar } from '../../components/ProgressBar'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'

const gasLimit = 1000000 // temporary value

export const LatestBlocks: FC = () => {
  const { t } = useTranslation()
  const blocksQuery = useGetEmeraldBlocks({ limit: 5 })
  const tableColumns = [
    { content: t('common.table.fill') },
    { content: t('common.table.block'), align: TableCellAlign.Right },
    { content: t('common.table.age'), align: TableCellAlign.Right },
    { content: t('common.table.txs'), align: TableCellAlign.Right },
    { content: t('common.table.size'), align: TableCellAlign.Right },
  ]
  const tableRows = blocksQuery.data?.data.blocks?.map(block => ({
    key: block.hash!,
    data: [
      {
        content: <VerticalProgressBar variant="determinate" value={(100 * block.gas_used!) / gasLimit} />,
        key: 'fill',
      },
      {
        align: TableCellAlign.Right,
        content: (
          <Link component={RouterLink} to="blocks">
            {block.round}
          </Link>
        ),
        key: 'block',
      },
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
      {
        align: TableCellAlign.Right,
        content: t('common.table.bytes', { value: block.size_bytes }),
        key: 'size',
      },
    ],
  }))

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('blocks.latest')}
        action={
          <Link component={RouterLink} to="blocks">
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <Table
          columns={tableColumns}
          rows={tableRows}
          name={t('blocks.header')}
          isLoading={blocksQuery.isLoading}
        />
      </CardContent>
    </Card>
  )
}
