import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import { useRouteError } from 'react-router-dom'
import { ThemeByScope } from '../../components/ThemeByScope'
import { useScopeParam } from '../../hooks/useScopeParam'

export const RoutingErrorPage: FC = () => {
  const scope = useScopeParam()
  return (
    <ThemeByScope isRootTheme={true} network={scope?.network ?? 'mainnet'} layer={scope?.layer}>
      <PageLayout>
        <Divider variant="layout" />
        <ErrorDisplay error={useRouteError()} />
      </PageLayout>
    </ThemeByScope>
  )
}
