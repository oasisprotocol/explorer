import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequiredScopeParam, useScopeParam } from '../../hooks/useScopeParam'
import { getNetworkNames, Network } from '../../../types/network'
import { FreshnessInfo, useConsensusFreshness, useIsApiReachable, useRuntimeFreshness } from './hook'
import { SearchScope, getNameForScope } from '../../../types/searchScope'
import { exhaustedTypeWarning } from '../../../types/errors'
import { StickyAlert } from '../StickyAlert'

export const NetworkOfflineBanner: FC<{ wantedNetwork?: Network }> = ({ wantedNetwork }) => {
  const scope = useScopeParam()
  const { t } = useTranslation()
  const targetNetwork = wantedNetwork || scope?.network || Network.mainnet
  const isNetworkReachable = useIsApiReachable(targetNetwork)
  const networkNames = getNetworkNames(t)
  const target = networkNames[targetNetwork]
  if (!isNetworkReachable.reachable) {
    if (isNetworkReachable.reason === 'userOffline') {
      return <StickyAlert severity="warning">{t('home.userOffline', { target })}</StickyAlert>
    }
    if (isNetworkReachable.reason === 'apiOffline') {
      return <StickyAlert severity="warning">{t('home.apiOffline', { target })}</StickyAlert>
    }
    exhaustedTypeWarning('Unexpected isNetworkReachable reason', isNetworkReachable.reason)
  }
  return null
}

type OfflineBannerProps = {
  layerStatus: FreshnessInfo
  scope: SearchScope
}

export const OfflineBanner: FC<OfflineBannerProps> = ({ layerStatus, scope }) => {
  const { t } = useTranslation()
  const { outOfDate, lastUpdate, unavailable } = layerStatus
  if (!outOfDate && !unavailable) return null
  const target = getNameForScope(t, scope)

  return (
    <StickyAlert severity="warning">
      {unavailable
        ? t('home.layerUnavailable', { target })
        : lastUpdate
          ? t('home.layerOutOfDateSince', { target, lastUpdate })
          : t('home.layerOutOfDate', { target })}
    </StickyAlert>
  )
}

export const ConsensusOfflineBanner: FC = () => {
  const scope = useRequiredScopeParam()
  const layerStatus = useConsensusFreshness(scope.network)

  return <OfflineBanner layerStatus={layerStatus} scope={scope} />
}

export const RuntimeOfflineBanner: FC = () => {
  const scope = useRequiredScopeParam()
  const layerStatus = useRuntimeFreshness(scope)

  return <OfflineBanner layerStatus={layerStatus} scope={scope} />
}
