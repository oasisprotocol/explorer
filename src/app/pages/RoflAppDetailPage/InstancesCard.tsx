import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { instancesContainerId } from '../../utils/tabAnchors'
import { CardEmptyState } from 'app/components/CardEmptyState'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from 'app/config'
import { InstancesList } from './InstancesList'

export const InstancesCard: FC = () => {
  return (
    <LinkableCardLayout containerId={instancesContainerId} title="">
      <InstancesView />
    </LinkableCardLayout>
  )
}

const InstancesView: FC = () => {
  const { t } = useTranslation()

  // TODO: waits for API, add pagination
  const isLoading = false
  const isFetched = true
  const instances = []

  return (
    <>
      {isFetched && !instances?.length && <CardEmptyState label={t('rofl.emptyInstancesList')} />}
      <InstancesList
        instances={instances}
        isLoading={isLoading}
        limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
        pagination={false}
      />
    </>
  )
}
