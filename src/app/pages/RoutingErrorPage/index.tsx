import { FC } from 'react'
import { PageLayout } from '../../components/PageLayout'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import { useRouteError } from 'react-router-dom'
import { ThemeByScope } from '../../components/ThemeByScope'
import { useScopeParam } from '../../hooks/useScopeParam'
import { LayoutDivider } from '../../components/Divider'

export const RoutingErrorPage: FC = () => {
  const scope = useScopeParam()
  return (
    <ThemeByScope network={scope?.network ?? 'mainnet'}>
      <PageLayout>
        <LayoutDivider />
        <ErrorDisplay error={useRouteError()} />
      </PageLayout>
    </ThemeByScope>
  )
}
