import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, To } from 'react-router-dom'

export type TablePaginationProps = {
  linkToPage: (page: number) => To
  rowsPerPage: number
  selectedPage: number
  offsetCount: number | undefined
}

// API counts maximum 1000 items
const maximumOffsetCount = 1000

export const TablePagination: FC<TablePaginationProps> = ({
  selectedPage,
  linkToPage,
  rowsPerPage,
  offsetCount,
}) => {
  const { t } = useTranslation()

  if (!offsetCount) {
    return null
  }
  const totalCount = Math.min(offsetCount + (selectedPage - 1) * rowsPerPage, maximumOffsetCount)
  const numberOfPages = Math.ceil(totalCount / rowsPerPage)

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
