import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { useSearchParamsPagination } from '../Table/useSearchParamsPagination'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'

interface LoadMoreButtonProps {
  isLoading?: boolean
  pagination: ReturnType<typeof useSearchParamsPagination>
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ isLoading, pagination }) => {
  const { t } = useTranslation()

  return (
    <Link asChild>
      <RouterLink to={pagination.linkToPage(pagination.selectedPage + 1)} preventScrollReset={true}>
        <Button color="primary" disabled={isLoading}>
          {t('common.loadMore')}
        </Button>
      </RouterLink>
    </Link>
  )
}
