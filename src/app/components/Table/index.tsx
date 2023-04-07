import { FC, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import TableContainer from '@mui/material/TableContainer'
import MuiTable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow, { TableRowProps as MuiTableRowProps } from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { TablePagination, TablePaginationProps } from './TablePagination'
import { backgroundColorAnimation } from '../../../styles/theme/animations'

type SkeletonTableRowsProps = {
  rowsNumber: number
  columnsNumber: number
}
// in designs table row has 61px height, but we need to take into account border and padding here
const textSkeletonHeight = 28
const SkeletonTableRows: FC<SkeletonTableRowsProps> = ({ rowsNumber, columnsNumber }) => (
  <>
    {[...Array(rowsNumber)].map((item, index) => (
      <TableRow key={index}>
        <TableCell colSpan={columnsNumber}>
          <Skeleton variant="text" height={textSkeletonHeight} />
        </TableCell>
      </TableRow>
    ))}
  </>
)

type StyledTableRowProps = MuiTableRowProps & {
  highlight?: boolean
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: prop => prop !== 'highlight',
})<StyledTableRowProps>(({ highlight }) => ({
  ...(highlight && backgroundColorAnimation),
}))

export enum TableCellAlign {
  Left = 'left',
  Right = 'right',
}

type TableCellProps = {
  align?: TableCellAlign
  content: ReactNode
  key: string
}

export type TableRowProps = {
  key: string
  data: TableCellProps[]
  highlight?: boolean
}

export type TableColProps = {
  content: string
  align?: TableCellAlign
  width?: string
}
type TableProps = {
  columns: TableColProps[]
  name: string
  isLoading: boolean
  pagination: false | TablePaginationProps
  rows?: TableRowProps[]
  rowsNumber?: number
  stickyColumn?: boolean
}

const stickyColumnStyles = {
  position: 'sticky',
  left: 0,
  backgroundColor: COLORS.antiFlashWhite,
  zIndex: 1,
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

  if (!isLoading && !rows?.length) {
    return null
  }

  return (
    <>
      <TableContainer>
        <MuiTable aria-label={name}>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.content}
                  align={column.align}
                  sx={{
                    width: column.width || 'auto',
                    ...(stickyColumn && !index && isMobile ? stickyColumnStyles : {}),
                  }}
                >
                  {column.content}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!rows && isLoading && (
              <SkeletonTableRows rowsNumber={rowsNumber} columnsNumber={columns.length} />
            )}
            {rows?.map(row => (
              <StyledTableRow key={row.key} highlight={row.highlight}>
                {row.data.map((cell, index) => (
                  <TableCell
                    key={cell.key}
                    align={cell.align}
                    sx={stickyColumn && !index && isMobile ? stickyColumnStyles : undefined}
                  >
                    {cell.content}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {pagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TablePagination {...pagination} />
        </Box>
      )}
    </>
  )
}
