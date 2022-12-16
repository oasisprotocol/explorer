import { Link as RouterLink } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import { Table, TableCellAlign } from '../../components/Table'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'

export function LatestBlocks() {
  const blocksQuery = useGetEmeraldBlocks({ limit: 5 })
  const tableRows = blocksQuery.data?.data.blocks?.map(block => ({
    key: block.hash!,
    data: [
      {
        content: (
          <Link component={RouterLink} to="blocks">
            {block.round}
          </Link>
        ),
        key: 'round',
      },
      {
        content: (
          <Link component={RouterLink} to="blocks">
            {block.hash?.substring(0, 8)}
          </Link>
        ),
        key: 'hash',
      },
      {
        content: block.num_transactions,
        key: 'txs',
      },
      {
        align: TableCellAlign.Right,
        content: formatDistance(new Date(block.timestamp!), new Date(), { addSuffix: true }),
        key: 'time',
      },
    ],
  }))

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title="Latest Blocks"
        action={
          <Link component={RouterLink} to="blocks">
            View all
          </Link>
        }
      />
      <CardContent>
        <Table
          columns={[
            { content: 'Round' },
            { content: 'Hash' },
            { content: 'Txs' },
            { content: 'Time', align: TableCellAlign.Right },
          ]}
          rows={tableRows}
          name="Latest Blocks"
          isLoading={blocksQuery.isLoading}
        />
      </CardContent>
    </Card>
  )
}
