import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsensusEventsList } from '../../components/ConsensusEvents/ConsensusEventsList'
import { ConsensusAccountDetailsContext } from './hooks'
import { LinkableCardLayout } from 'app/components/LinkableCardLayout'

export const eventsContainerId = 'events'

export const ConsensusAccountEventsCard: FC<ConsensusAccountDetailsContext> = () => {
  const { t } = useTranslation()

  return (
    <LinkableCardLayout containerId={eventsContainerId} title={t('common.events')}>
      {/* TODO */}
      <ConsensusEventsList />
    </LinkableCardLayout>
  )
}
