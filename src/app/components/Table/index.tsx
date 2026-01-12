import { ComponentProps, FC, ReactNode } from 'react'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/skeleton'
import {
  Table as BaseTable,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@oasisprotocol/ui-library/src/components/table'
import { TablePagination, TablePaginationProps } from './TablePagination'
import { CardEmptyState } from '../CardEmptyState'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type SkeletonTableRowsProps = {
  rowsNumber: number
  columnsNumber: number
}

const SkeletonTableRows: FC<SkeletonTableRowsProps> = ({ rowsNumber, columnsNumber }) => (
  <>
    {[...Array(rowsNumber)].map((item, index) => (
      <TableRow key={index}>
        <TableCell colSpan={columnsNumber}>
          {/* In designs table row has 61px height, but we need to take into account border and padding here */}
          <Skeleton className="h-[28px]" />
        </TableCell>
      </TableRow>
    ))}
  </>
)

type StyledTableRowProps = ComponentProps<typeof TableRow> & {
  highlight?: boolean
  backgroundColor?: string
}

export const StyledTableRow: FC<StyledTableRowProps> = ({ highlight, backgroundColor, ...props }) => (
  <TableRow
    {...props}
    className={cn(highlight && 'animate-[flash_3s_ease-in-out_1]')}
    style={backgroundColor ? { backgroundColor } : undefined}
  />
)

export enum TableCellAlign {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

const getAlignClass = (align?: TableCellAlign): string => {
  switch (align) {
    case TableCellAlign.Center:
      return 'text-center'
    case TableCellAlign.Right:
      return 'text-right'
    case TableCellAlign.Left:
    default:
      return 'text-left'
  }
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

export const Table: FC<TableProps> = ({
  columns,
  isLoading,
  name,
  pagination,
  rows,
  rowsNumber = 5,
  extraHorizontalSpaceOnMobile = false,
  alwaysWaitWhileLoading = false,
  emptyMessage = undefined,
}) => {
  return !isLoading && !rows?.length ? ( // This is known to be empty
    emptyMessage ? ( // If we have a message, show it
      <CardEmptyState label={emptyMessage} />
    ) : null // otherwise just show nothing
  ) : (
    <>
      <BaseTable aria-label={name}>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => {
              if (column.hide) {
                return null
              }
              return (
                <TableHead
                  key={column.key}
                  className={getAlignClass(column.align)}
                  style={{
                    width: column.width || 'auto',
                  }}
                >
                  {column.content}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
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
                    className={cn(getAlignClass(cell.align), extraHorizontalSpaceOnMobile && 'sm:px-8')}
                  >
                    {cell.content}
                  </TableCell>
                )
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </BaseTable>
      {pagination && (
        <div className="flex justify-center">
          <TablePagination {...pagination} />
        </div>
      )}
    </>
  )
}
