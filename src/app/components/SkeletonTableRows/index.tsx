import { FC } from 'react'
import Skeleton from '@mui/material/Skeleton'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

type SkeletonTableRowsProps = {
  rowsNumber: number
  columnsNumber: number
}

export const SkeletonTableRows: FC<SkeletonTableRowsProps> = ({ rowsNumber, columnsNumber }) => (
  <>
    {[...Array(rowsNumber)].map((item, index) => (
      <TableRow key={index}>
        <TableCell colSpan={columnsNumber}>
          <Skeleton variant="text" />
        </TableCell>
      </TableRow>
    ))}
  </>
)
