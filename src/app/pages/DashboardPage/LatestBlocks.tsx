import { Link as RouterLink } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { SkeletonTableRows } from '../../components/SkeletonTableRows'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'

export function LatestBlocks() {
  const blocksQuery = useGetEmeraldBlocks({ limit: 5 })

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
        <TableContainer>
          <Table aria-label="Latest Blocks ">
            <TableHead>
              <TableRow>
                <TableCell>Round</TableCell>
                <TableCell>Hash</TableCell>
                <TableCell>Txs</TableCell>
                <TableCell align="right">Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!blocksQuery.data?.data && blocksQuery.isLoading && (
                <SkeletonTableRows rowsNumber={5} columnsNumber={5} />
              )}
              {blocksQuery.data?.data.blocks?.map(block => (
                <TableRow key={block.hash}>
                  <TableCell>
                    <Link component={RouterLink} to="blocks">
                      {block.round}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link component={RouterLink} to="blocks">
                      {block.hash?.substring(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>{block.num_transactions}</TableCell>
                  <TableCell align="right">
                    {formatDistance(new Date(block.timestamp!), new Date(), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
