import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useScreenSize } from '../../hooks/useScreensize'
import { TransactionsStats } from '../../components/TransactionsStats'
import { Social } from '../../components/Social'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'

export const ConsensusDashboardPage: FC = () => {
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()

  return (
    <PageLayout>
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <TransactionsStats scope={scope} />
      <Social />
    </PageLayout>
  )
}
