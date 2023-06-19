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
import { useScreenSize } from '../../hooks/useScreensize'
import { COLORS } from '../../../styles/theme/colors'
import { TablePagination, TablePaginationProps } from './TablePagination'
import { backgroundColorAnimation } from '../../../styles/theme/animations'

type SkeletonTableRowsProps = {
  rowsNumber: number
  columnsNumber: number
  verbose: boolean
}

const StyledTableCell = styled(TableCell, {
  shouldForwardProp: prop => prop !== 'verbose',
})<{ verbose?: boolean }>(({ theme, verbose }) => ({
  ...(!verbose
    ? {
        padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
      }
    : {}),
}))

// in designs table row has 61px height, but we need to take into account border and padding here
const textSkeletonHeight = 28
const SkeletonTableRows: FC<SkeletonTableRowsProps> = ({ rowsNumber, columnsNumber, verbose }) => (
  <>
    {[...Array(rowsNumber)].map((item, index) => (
      <TableRow key={index}>
        <StyledTableCell colSpan={columnsNumber}>
          <Skeleton variant="text" height={textSkeletonHeight} />
        </StyledTableCell>
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
  Center = 'center',
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
  verbose?: boolean
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
  verbose = true,
}) => {
  const { isMobile } = useScreenSize()

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
                <StyledTableCell
                  key={column.content}
                  align={column.align}
                  sx={{
                    width: column.width || 'auto',
                    ...(stickyColumn && !index && isMobile ? stickyColumnStyles : {}),
                  }}
                  verbose={verbose}
                >
                  {column.content}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!rows && isLoading && (
              <SkeletonTableRows rowsNumber={rowsNumber} columnsNumber={columns.length} verbose={verbose} />
            )}
            {rows?.map(row => (
              <StyledTableRow key={row.key} highlight={row.highlight}>
                {row.data.map((cell, index) => (
                  <StyledTableCell
                    key={cell.key}
                    align={cell.align}
                    sx={stickyColumn && !index && isMobile ? stickyColumnStyles : undefined}
                    verbose={verbose}
                  >
                    {cell.content}
                  </StyledTableCell>
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
