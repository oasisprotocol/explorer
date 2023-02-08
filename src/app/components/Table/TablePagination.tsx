import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, To } from 'react-router-dom'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

export type TablePaginationProps = {
  prevNextOnly?: boolean
  hasMore?: boolean
  selectedPage: number
  linkToPage: (page: number) => To
}

// API does not return info about total number of items/pages so we hardcode it
const numberOfPages = 100
// -2 means not to render current and next page number
const negatedSiblingCount = -2

export const TablePagination: FC<TablePaginationProps> = ({
  prevNextOnly,
  hasMore,
  selectedPage,
  linkToPage,
}) => {
  const { t } = useTranslation()

  return (
    <Pagination
      boundaryCount={prevNextOnly ? 0 : undefined}
      siblingCount={prevNextOnly ? negatedSiblingCount : undefined}
      count={prevNextOnly ? (hasMore ? numberOfPages : selectedPage) : numberOfPages}
      page={selectedPage}
      renderItem={item => (
        <PaginationItem
          hidden={prevNextOnly && ['end-ellipsis', 'start-ellipsis'].includes(item.type)}
          slots={{
            first: () => <>{t('pagination.first')}</>,
            last: () => <>{t('pagination.last')}</>,
            previous: () => (
              <>
                <NavigateBeforeIcon fontSize="small" /> {t('pagination.previous')}
              </>
            ),
            next: () => (
              <>
                {t('pagination.next')} <NavigateNextIcon fontSize="small" />
              </>
            ),
          }}
          component={Link}
          to={item.page == null ? '' : linkToPage(item.page)}
          {...item}
        />
      )}
      showFirstButton={!prevNextOnly}
      showLastButton={!prevNextOnly}
      size="small"
      sx={{ marginTop: 5 }}
    />
  )
}
