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
import { CardEmptyState } from '../CardEmptyState'

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
  backgroundColor?: string
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: prop => prop !== 'highlight' && prop !== 'backgroundColor',
})<StyledTableRowProps>(({ backgroundColor, highlight }) => ({
  ...(highlight && backgroundColorAnimation),
  ...(backgroundColor && { backgroundColor }),
}))

export enum TableCellAlign {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

type TableCellProps = {
  align?: TableCellAlign
  content: ReactNode
  hide?: boolean
  key: string
}

export type TableRowProps = {
  key: string
  data: TableCellProps[]
  highlight?: boolean
  backgroundColor?: string
}

export type TableColProps = {
  align?: TableCellAlign
  content: ReactNode
  hide?: boolean
  key: string
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
  extraHorizontalSpaceOnMobile?: boolean | undefined
  alwaysWaitWhileLoading?: boolean | undefined
  /**
   * Optional message to display when there are zero entries, instead of the table.
   *
   * This will only be displayed when loading finishes and there are no records.
   * If not given, the table will simply be hidden without any trace.
   */
  emptyMessage?: string | undefined
}

const stickyColumnStyles = {
  position: 'sticky',
  left: 0,
  backgroundColor: COLORS.antiFlashWhite,
  zIndex: 1,
}

const extraHorizontalPaddingStyles = {
  px: 4,
}

export const Table: FC<TableProps> = ({
  columns,
  isLoading,
  name,
  pagination,
  rows,
  rowsNumber = 5,
  stickyColumn = false,
  extraHorizontalSpaceOnMobile = false,
  alwaysWaitWhileLoading = false,
  emptyMessage = undefined,
}) => {
  const { isMobile } = useScreenSize()

  return !isLoading && !rows?.length ? ( // This is known to be empty
    emptyMessage ? ( // If we have a message, show it
      <CardEmptyState label={emptyMessage} />
    ) : null // otherwise just show nothing
  ) : (
    <>
      <TableContainer>
        <MuiTable aria-label={name}>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => {
                if (column.hide) {
                  return null
                }
                return (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    sx={{
                      width: column.width || 'auto',
                      ...(stickyColumn && !index && isMobile ? stickyColumnStyles : {}),
                    }}
                  >
                    {column.content}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {(alwaysWaitWhileLoading || !rows) && isLoading && (
              <SkeletonTableRows rowsNumber={rowsNumber} columnsNumber={columns.length} />
            )}
            {rows?.map(row => (
              <StyledTableRow key={row.key} highlight={row.highlight} backgroundColor={row.backgroundColor}>
                {row.data.map((cell, index) => {
                  if (cell.hide) {
                    return null
                  }
                  return (
                    <TableCell
                      key={cell.key}
                      align={cell.align}
                      sx={{
                        ...(stickyColumn && !index && isMobile ? stickyColumnStyles : {}),
                        ...(extraHorizontalSpaceOnMobile && isMobile ? extraHorizontalPaddingStyles : {}),
                      }}
                    >
                      {cell.content}
                    </TableCell>
                  )
                })}
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
