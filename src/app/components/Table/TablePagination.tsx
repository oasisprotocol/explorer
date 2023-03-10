import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, To } from 'react-router-dom'

export type TablePaginationProps = {
  linkToPage: (page: number) => To
  rowsPerPage: number
  selectedPage: number
  totalCount: number | undefined
}

// API counts maximum 1000 items
// https://github.com/oasisprotocol/oasis-indexer/blob/e220d3f2872abff45e5a78fe6b1a1de961e18765/storage/client/client.go#L30
const maximumTotalCount = 1000

export const TablePagination: FC<TablePaginationProps> = ({
  selectedPage,
  linkToPage,
  rowsPerPage,
  totalCount,
}) => {
  const { t } = useTranslation()

  if (!totalCount) {
    return null
  }
  const totalCountBoundary = Math.min(totalCount + (selectedPage - 1) * rowsPerPage, maximumTotalCount)
  const numberOfPages = Math.ceil(totalCountBoundary / rowsPerPage)

  return (
    <Pagination
      count={numberOfPages}
      page={selectedPage}
      renderItem={item => (
        <PaginationItem
          slots={{
            first: () => <>{t('pagination.first')}</>,
            last: () => <>{t('pagination.last')}</>,
          }}
          component={Link}
          to={item.page == null ? '' : linkToPage(item.page)}
          {...item}
        />
      )}
      showFirstButton
      showLastButton
      size="small"
      sx={{ marginTop: 5 }}
    />
  )
}
