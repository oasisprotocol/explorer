import { useParams } from 'react-router-dom'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { CopyToClipboard } from '../../components/CopyToClipboard'

// TODO: replace with an appropriate API
function useGetEmeraldBlockByHeight(blockHeight: number) {
  const blockQuery = useGetEmeraldBlocks({ to: blockHeight, limit: 1 })
  const block = blockQuery.data?.data?.blocks?.[0]!
  return {
    ...blockQuery,
    data: { data: block },
  }
}

export function BlockDetailPage() {
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetEmeraldBlockByHeight(blockHeight)
  const block = data.data

  return (
    <PageLayout>
      <Card>
        <CardHeader disableTypography component="h3" title="Block" />
        {isLoading && (
          <CardContent>
            <Skeleton variant="text" height={30} sx={{ my: 4 }} />
            <Skeleton variant="text" height={30} sx={{ my: 4 }} />
            <Skeleton variant="text" height={30} sx={{ my: 4 }} />
            <Skeleton variant="text" height={30} sx={{ my: 4 }} />
            <Skeleton variant="text" height={30} sx={{ my: 4 }} />
          </CardContent>
        )}
        {block && (
          <CardContent>
            <StyledDescriptionList titleWidth="200px">
              <dt>Block</dt>
              <dd>{block.round}</dd>

              <dt>Age</dt>
              <dd>
                {formatDistanceStrict(new Date(block.timestamp!), new Date(), {
                  addSuffix: true,
                })}
              </dd>

              <dt>Size</dt>
              <dd>{block.size_bytes?.toLocaleString()} bytes</dd>

              <dt>Transactions</dt>
              <dd>{block.num_transactions} transactions</dd>

              <dt>Hash</dt>
              <dd>
                <CopyToClipboard value={`0x${block.hash}`} />
              </dd>

              <dt>Gas Used</dt>
              <dd>{block.gas_used?.toLocaleString()}</dd>
            </StyledDescriptionList>
          </CardContent>
        )}
      </Card>
    </PageLayout>
  )
}
