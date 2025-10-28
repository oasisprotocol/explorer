import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { COLORS } from '../../../styles/theme/colors'
import { useSearchParamsPagination } from '../Table/useSearchParamsPagination'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'

const StyledLoadMoreButton = styled(Button)(() => ({
  backgroundColor: COLORS.brandDark,
}))

interface LoadMoreButtonProps {
  isLoading?: boolean
  pagination: ReturnType<typeof useSearchParamsPagination>
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ isLoading, pagination }) => {
  const { t } = useTranslation()

  return (
    <Link asChild>
      <RouterLink to={pagination.linkToPage(pagination.selectedPage + 1)} preventScrollReset={true}>
        <StyledLoadMoreButton color="primary" variant="contained" disabled={isLoading}>
          {t('common.loadMore')}
        </StyledLoadMoreButton>
      </RouterLink>
    </Link>
  )
}
