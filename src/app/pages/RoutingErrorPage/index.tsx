import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { RoutingErrorDisplay } from '../../components/ErrorDisplay'

export const RoutingErrorPage: FC = () => {
  return (
    <PageLayout>
      <Divider variant="layout" />
      <RoutingErrorDisplay />
    </PageLayout>
  )
}
