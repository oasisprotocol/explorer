import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import { useRouteError } from 'react-router-dom'
import { ThemeByNetwork } from '../../components/ThemeByNetwork'
import { useScopeParam } from '../../hooks/useScopeParam'
import { Network } from '../../../types/network'

export const RoutingErrorPage: FC = () => {
  const scope = useScopeParam()
  return (
    <ThemeByNetwork network={scope?.network ?? Network.mainnet}>
      <PageLayout>
        <Divider variant="layout" />
        <ErrorDisplay error={useRouteError()} />
      </PageLayout>
    </ThemeByNetwork>
  )
}
