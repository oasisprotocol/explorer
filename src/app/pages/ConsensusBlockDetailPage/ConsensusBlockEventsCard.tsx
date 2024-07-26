import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsensusEventsList } from '../../components/ConsensusEvents/ConsensusEventsList'
import { ConsensusBlockDetailsContext } from '.'
import { LinkableCardLayout } from 'app/components/LinkableCardLayout'

export const eventsContainerId = 'events'

export const ConsensusBlockEventsCard: FC<ConsensusBlockDetailsContext> = () => {
  const { t } = useTranslation()

  return (
    <LinkableCardLayout containerId={eventsContainerId} title={t('common.events')}>
      <ConsensusEventsList />
    </LinkableCardLayout>
  )
}
