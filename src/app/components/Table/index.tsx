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
  key: string
  content: ReactNode
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
  extraHorizontalSpaceOnMobile?: boolean | undefined
  alwaysWaitWhileLoading?: boolean | undefined
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
}) => {
  const { isMobile } = useScreenSize()

  if (!isLoading && !rows?.length) {
    return null
  }

  return (
    <>
      <TableContainer
        sx={{ width: '100% !important', marginLeft: '0 !important', paddingRight: '0 !important' }}
      >
        <MuiTable aria-label={name} sx={{ display: 'flex' }}>
          <TableHead sx={{ display: 'flex' }}>
            <TableRow
              sx={{
                display: 'flex',

                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
              }}
            >
              {columns.map((column, index) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={{
                    display: 'flex',
                    width: column.width || 'auto',
                    ...(stickyColumn && !index && isMobile ? stickyColumnStyles : {}),
                  }}
                >
                  {column.content}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            {(alwaysWaitWhileLoading || !rows) && isLoading && (
              <SkeletonTableRows rowsNumber={rowsNumber} columnsNumber={columns.length} />
            )}
            {rows?.map(row => (
              <StyledTableRow
                key={row.key}
                highlight={row.highlight}
                sx={{ backgroundColor: 'white', borderRadius: 5, marginBottom: '16px', padding: '8px 16px' }}
              >
                {row.data.map((cell, index) => (
                  <TableCell
                    data-title={columns[index].content}
                    key={cell.key}
                    // align={cell.align}
                    sx={{
                      display: 'flex',
                      content: 'attr(data-title)',
                      border: 'none',
                      position: 'relative',
                      padding: '8px 0 8px 0',
                      '&:before': {
                        width: '100px',
                        content: 'attr(data-title)',
                        whiteSpace: 'break-spaces',
                      },

                      ...(stickyColumn && !index && isMobile ? stickyColumnStyles : {}),
                      ...(extraHorizontalSpaceOnMobile && isMobile ? extraHorizontalPaddingStyles : {}),
                    }}
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
