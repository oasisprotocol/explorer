import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import { useRouteError } from 'react-router-dom'

export const RoutingErrorPage: FC = () => {
  return (
    <PageLayout>
      <Divider variant="layout" />
      <ErrorDisplay error={useRouteError()} />
    </PageLayout>
  )
}
