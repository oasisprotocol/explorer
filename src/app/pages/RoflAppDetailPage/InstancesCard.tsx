import { FC } from 'react'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { instancesContainerId } from '../../utils/tabAnchors'

export const InstancesCard: FC = () => {
  return (
    <LinkableCardLayout containerId={instancesContainerId} title="">
      {' '}
    </LinkableCardLayout>
  )
}
