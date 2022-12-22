import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import usePagination, { type UsePaginationProps } from '@mui/material/usePagination'
import { styled } from '@mui/material/styles'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import { COLORS } from '../../../styles/theme/colors'
import { useSearchParams } from 'react-router-dom'

const StyledList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: `${theme.spacing(5)} 0 0`,
  margin: 0,
  display: 'flex',
}))

const StyledListElement = styled('li')({
  padding: 0,
  margin: 0,
  display: 'inline-flex',
})

const StyledButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  background: 'none',
  boxShadow: 'none',
  padding: `0 ${theme.spacing(1)}`,
  margin: 0,
  cursor: 'pointer',
  border: 'none',
  font: 'inherit',
  color: COLORS.brandExtraDark,
  '&:disabled': {
    color: COLORS.disabledPagination,
    cursor: 'default',
  },
}))

const StyledFirstPageButton = styled(StyledButton)(({ theme }) => ({
  padding: `0 ${theme.spacing(3)} 0 ${theme.spacing(2)}`,
}))

const StyledLastPageButton = styled(StyledButton)(({ theme }) => ({
  padding: `0 ${theme.spacing(2)} 0 ${theme.spacing(3)}`,
}))

export const Pagination: FC<UsePaginationProps> = ({ count, onChange, page }) => {
  const { t } = useTranslation()
  const { items } = usePagination({
    showFirstButton: true,
    showLastButton: true,
    count,
    page,
    onChange,
  })
  const previousItem = items.find(item => item.type === 'previous')
  const nextItem = items.find(item => item.type === 'next')

  return (
    <nav>
      <StyledList>
        <StyledListElement>
          <StyledButton type="button" disabled={previousItem?.disabled} onClick={previousItem?.onClick}>
            <NavigateBeforeIcon />
          </StyledButton>
        </StyledListElement>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null
          const pageAfterEndEllipsis = index === items.length - 3
          if (type === 'page' && !pageAfterEndEllipsis) {
            children = (
              <StyledButton type="button" {...item} disabled={selected || item.disabled}>
                {page}
              </StyledButton>
            )
          } else if (type === 'first') {
            children = (
              <StyledFirstPageButton type="button" {...item}>
                {t('pagination.first')}
              </StyledFirstPageButton>
            )
          } else if (type === 'last') {
            children = (
              <StyledLastPageButton type="button" {...item}>
                {t('pagination.last')}
              </StyledLastPageButton>
            )
          }

          return <StyledListElement key={index}>{children}</StyledListElement>
        })}
        <StyledListElement>
          <StyledButton type="button" disabled={nextItem?.disabled} onClick={nextItem?.onClick}>
            <NavigateNextIcon />
          </StyledButton>
        </StyledListElement>
      </StyledList>
    </nav>
  )
}
