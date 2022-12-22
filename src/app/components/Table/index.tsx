import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import TableContainer from '@mui/material/TableContainer'
import MuiTable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { TablePagination } from './TablePagination'

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
  columnsNumber?: number
  name: string
  isLoading: boolean
  pagination?: {
    numberOfAllTransactions: number
  }
  rows?: TableRowProps[]
  rowsNumber?: number
  stickyColumn?: boolean
}

const stickyColumnStyles = {
  position: 'sticky',
  left: 0,
  backgroundColor: COLORS.antiFlashWhite,
}

export const Table: FC<TableProps> = ({
  columns,
  isLoading,
  name,
  pagination,
  rows,
  rowsNumber = 5,
  stickyColumn = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <TableContainer>
      <MuiTable aria-label={name}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column.content}
                align={column.align}
                sx={stickyColumn && !index && isMobile ? stickyColumnStyles : undefined}
              >
                {column.content}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!rows && isLoading && <SkeletonTableRows rowsNumber={rowsNumber} columnsNumber={columns.length} />}
          {rows?.map(row => (
            <TableRow key={row.key}>
              {row.data.map((cell, index) => (
                <TableCell
                  key={cell.key}
                  align={cell.align}
                  sx={stickyColumn && !index && isMobile ? stickyColumnStyles : undefined}
                >
                  {cell.content}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
      {!!pagination?.numberOfAllTransactions && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TablePagination count={pagination.numberOfAllTransactions} rowsNumber={rowsNumber} />
        </Box>
      )}
    </TableContainer>
  )
}
