import { FC } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { ConsensusEventsList } from '../../components/ConsensusEvents/ConsensusEventsList'
import { ConsensusAccountDetailsContext } from './hooks'

export const eventsContainerId = 'events'

export const ConsensusAccountEventsCard: FC<ConsensusAccountDetailsContext> = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={eventsContainerId}>
        <CardHeader disableTypography component="h3" title={t('common.events')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <ConsensusEventsList />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
