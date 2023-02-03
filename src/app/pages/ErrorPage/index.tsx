import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { ErrorBoundary } from '../../components/ErrorBoundary'

export const ErrorPage: FC = () => {
  return (
    <PageLayout>
      <Divider variant="layout" />
      <ErrorBoundary />
    </PageLayout>
  )
}
