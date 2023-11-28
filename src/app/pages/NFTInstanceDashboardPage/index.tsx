import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { Layer } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'

export const NFTInstanceDashboardPage: FC = () => {
  const scope = useRequiredScopeParam()
  const { address, instanceId } = useParams()
  if (scope.layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }

  if (!address || !instanceId) {
    throw AppErrors.InvalidUrl
  }

  return <PageLayout />
}
