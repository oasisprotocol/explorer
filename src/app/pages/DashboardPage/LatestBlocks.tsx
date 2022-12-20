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
const tableColumns = [
  { content: 'Fill' },
  { content: 'Block', align: TableCellAlign.Right },
  { content: 'Age', align: TableCellAlign.Right },
  { content: 'Txs', align: TableCellAlign.Right },
  { content: 'Size', align: TableCellAlign.Right },
]

export function LatestBlocks() {
  const blocksQuery = useGetEmeraldBlocks({ limit: 5 })
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
        content: `${block.size_bytes} bytes`,
        key: 'size',
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
          columns={tableColumns}
          rows={tableRows}
          name="Latest Blocks"
          isLoading={blocksQuery.isLoading}
        />
      </CardContent>
    </Card>
  )
}
