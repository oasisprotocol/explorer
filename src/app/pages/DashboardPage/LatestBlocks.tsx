import { Link as RouterLink } from 'react-router-dom'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { Table, TableCellAlign } from '../../components/Table'
import { VerticalProgressBar } from '../../components/ProgressBar'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { AppCard } from '../../components/AppCard/AppCard'
import { AppCardHeader } from '../../components/AppCardHeader/AppCardHeader'
import { AppLink } from '../../components/AppLink/AppLink'
import { AppCardContent } from '../../components/AppCardContent/AppCardContent'

const gasLimit = 1000000 // temporary value

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
          <AppLink component={RouterLink} to="blocks">
            {block.round}
          </AppLink>
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
    <AppCard>
      <AppCardHeader
        disableTypography
        component="h3"
        title="Latest Blocks"
        action={
          <AppLink component={RouterLink} to="blocks">
            View all
          </AppLink>
        }
      />
      <AppCardContent>
        <Table
          columns={[
            { content: 'Fill' },
            { content: 'Block', align: TableCellAlign.Right },
            { content: 'Age', align: TableCellAlign.Right },
            { content: 'Txs', align: TableCellAlign.Right },
            { content: 'Size', align: TableCellAlign.Right },
          ]}
          rows={tableRows}
          name="Latest Blocks"
          isLoading={blocksQuery.isLoading}
        />
      </AppCardContent>
    </AppCard>
  )
}
