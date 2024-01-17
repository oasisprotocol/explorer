import { FC } from 'react'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useScreenSize } from '../../hooks/useScreensize'
import { Social } from '../../components/Social'

export const ConsensusDashboardPage: FC = () => {
  const { isMobile } = useScreenSize()

  return (
    <PageLayout>
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <Social />
    </PageLayout>
  )
}
