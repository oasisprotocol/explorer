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

export const OfflineBanner: FC<OfflineBannerProps> = props => {
  const { t } = useTranslation()
  const { outOfDateReason, lastUpdate, unavailable } = props.layerStatus
  const scope = getNameForScope(t, props.scope)

  if (unavailable) {
    return <StickyAlert severity="warning">{t('home.indexerUnavailable', { scope })}</StickyAlert>
  }
  if (outOfDateReason === undefined) return null
  if (outOfDateReason === false) return null

  if (outOfDateReason === 'indexer') {
    return (
      <StickyAlert severity="warning">
        {lastUpdate
          ? t('home.indexerOutOfDateSince', { scope, lastUpdate })
          : t('home.indexerOutOfDate', { scope })}
      </StickyAlert>
    )
  }
  if (outOfDateReason === 'blocks') {
    // Don't display lastUpdate. It's updating, but still many blocks behind.
    return <StickyAlert severity="warning">{t('home.indexerOutOfDate', { scope })}</StickyAlert>
  }
  if (outOfDateReason === 'node') {
    return <StickyAlert severity="warning">{t('home.nodeOutOfDateSince', { scope, lastUpdate })}</StickyAlert>
  }
  exhaustedTypeWarning('Unexpected outOfDateReason', outOfDateReason)
  return <StickyAlert severity="warning">{t('home.indexerOutOfDate', { scope })}</StickyAlert>
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
