import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { ConsensusEventsList } from '../../components/ConsensusEvents/ConsensusEventsList'
import { ConsensusBlockDetailsContext } from '.'

export const eventsContainerId = 'events'

const EventsList: FC = () => {
  return <ConsensusEventsList />
}

export const ConsensusBlockEventsCard: FC<ConsensusBlockDetailsContext> = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={eventsContainerId}>
        <CardHeader disableTypography component="h3" title={t('common.events')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <EventsList />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
