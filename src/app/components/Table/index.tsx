import { FC, ReactNode } from 'react'
import Skeleton from '@mui/material/Skeleton'
import TableContainer from '@mui/material/TableContainer'
import MuiTable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

type SkeletonTableRowsProps = {
  rowsNumber: number
  columnsNumber: number
}

const SkeletonTableRows: FC<SkeletonTableRowsProps> = ({ rowsNumber, columnsNumber }) => (
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

export enum TableCellAlign {
  Left = 'left',
  Right = 'right',
}

type TableCellProps = {
  align?: TableCellAlign
  content: ReactNode
  key: string
}

type TableRowProps = {
  key: string
  data: TableCellProps[]
}

type TableProps = {
  columns: {
    content: string
    align?: TableCellAlign
  }[]
  name: string
  isLoading: boolean
  rows?: TableRowProps[]
}

export const Table: FC<TableProps> = ({ columns, isLoading, name, rows }) => {
  return (
    <TableContainer>
      <MuiTable aria-label={name}>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.content} align={column.align}>
                {column.content}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!rows && isLoading && <SkeletonTableRows rowsNumber={5} columnsNumber={5} />}
          {rows?.map(row => (
            <TableRow key={row.key}>
              {row.data.map(cell => (
                <TableCell key={cell.key} align={cell.align}>
                  {cell.content}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
