import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { InstanceTitleCard } from './InstanceTitleCard'
import { InstanceDetailsCard } from './InstanceDetailsCard'

export const NFTInstanceDashboardPage: FC = () => {
  const scope = useRequiredScopeParam()
  const { address, instanceId } = useParams()
  return (
    <PageLayout>
      <InstanceTitleCard scope={scope} contractAddress={address!} instanceId={instanceId!} />
      <InstanceDetailsCard scope={scope} contractAddress={address!} instanceId={instanceId!} />
    </PageLayout>
  )
}
