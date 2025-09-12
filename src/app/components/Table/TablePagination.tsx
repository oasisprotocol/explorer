import {
  Pagination,
  PaginationLink,
  PaginationItemProps,
} from '@oasisprotocol/ui-library/src/components/pagination'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, To } from 'react-router-dom'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

export type TablePaginationProps = {
  linkToPage: (page: number) => To
  rowsPerPage: number
  selectedPage: number
  totalCount: number | undefined
  isTotalCountClipped: boolean | undefined
  className?: string
}

export const TablePagination: FC<TablePaginationProps> = ({
  selectedPage,
  linkToPage,
  rowsPerPage,
  totalCount,
  isTotalCountClipped,
  className,
}) => {
  const { t } = useTranslation()

  if (!totalCount) {
    return null
  }
  const totalCountBoundary = totalCount + (selectedPage - 1) * rowsPerPage
  const numberOfPages = Math.ceil(totalCountBoundary / rowsPerPage)

  if (numberOfPages <= 1) {
    return null
  }

  return (
    <Pagination
      className={cn('mt-4', className)}
      totalCount={totalCount}
      selectedPage={selectedPage}
      rowsPerPage={rowsPerPage}
      showFirstPageButton
      showLastPageButton
      isTotalCountClipped={isTotalCountClipped}
      renderItem={(item: PaginationItemProps) => (
        <PaginationLink
          linkComponent={Link}
          to={item.page ? linkToPage(item.page) : ''}
          preventScrollReset={true}
          slots={{
            first: t('pagination.first'),
            last: t('pagination.last'),
          }}
          {...item}
        />
      )}
    />
  )
}
