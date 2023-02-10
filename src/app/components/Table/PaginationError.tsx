import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../PageLayout'
import { EmptyState } from '../EmptyState'

export const PaginationError: FC<{ light?: boolean }> = ({ light }) => {
  const { t } = useTranslation()
  return (
    <EmptyState title={t('errors.invalidPageNumber')} description={t('errors.validateURL')} light={light} />
  )
}

export const PaginationErrorPage: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <PageLayout>
      {!isMobile && <Divider variant="layout" />}
      <PaginationError />
    </PageLayout>
  )
}
