import { useLocalSettings } from 'app/hooks/useLocalSettings'
import { RouteUtils, fixedNetwork, fixedLayer } from 'app/utils/route-utils'
import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { SearchScope } from 'types/searchScope'

/**
 * In case of being restricted to a specific layer or layers, jump to a dashboard
 *
 * This should be rendered on the landing page, since we don't want the opening graph.
 */
export const RedirectToDashboard: FC = () => {
  const navigate = useNavigate()
  const {
    settings: { preferredScope },
  } = useLocalSettings()

  const getPreferredScope = () =>
    !preferredScope
      ? undefined
      : RouteUtils.getEnabledScopes().find(
          scope => scope.network === preferredScope.network && scope.layer === preferredScope.layer,
        )

  const getDefaultScope = (): SearchScope => ({
    network:
      (fixedNetwork ?? fixedLayer)
        ? RouteUtils.getEnabledNetworksForLayer(fixedLayer)[0]!
        : RouteUtils.getEnabledScopes()[0].network,
    layer: fixedLayer ?? RouteUtils.getEnabledScopes()[0].layer,
  })

  useEffect(() => {
    navigate(RouteUtils.getDashboardRoute(getPreferredScope() ?? getDefaultScope()))
  })
  return null
}
