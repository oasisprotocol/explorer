import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequiredScopeParam, useRuntimeScope, useScopeParam } from '../../hooks/useScopeParam'
import { getNetworkNames, Network } from '../../../types/network'
import { FreshnessInfo, useConsensusFreshness, useIsApiReachable, useRuntimeFreshness } from './hook'
import { SearchScope, getNameForScope } from '../../../types/searchScope'
import { exhaustedTypeWarning } from '../../../types/errors'
import { Alert } from '@oasisprotocol/ui-library/src/components/alert'

export const NetworkOfflineBanner: FC<{ wantedNetwork?: Network }> = ({ wantedNetwork }) => {
  const scope = useScopeParam()
  const { t } = useTranslation()
  const targetNetwork = wantedNetwork ?? scope?.network ?? 'mainnet'
  const isNetworkReachable = useIsApiReachable(targetNetwork)
  const networkNames = getNetworkNames(t)
  const target = networkNames[targetNetwork]
  if (!isNetworkReachable.reachable) {
    if (isNetworkReachable.reason === 'userOffline') {
      return (
        <Alert variant="warning-filled" sticky>
          {t('home.userOffline', { target })}
        </Alert>
      )
    }
    if (isNetworkReachable.reason === 'apiOffline') {
      return (
        <Alert variant="warning-filled" sticky>
          {t('home.apiOffline', { target })}
        </Alert>
      )
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
    return (
      <Alert variant="warning-filled" sticky>
        {t('home.indexerUnavailable', { scope })}
      </Alert>
    )
  }
  if (outOfDateReason === undefined) return null
  if (outOfDateReason === false) return null

  if (outOfDateReason === 'indexer') {
    return (
      <Alert variant="warning-filled" sticky>
        {lastUpdate
          ? t('home.indexerOutOfDateSince', { scope, lastUpdate })
          : t('home.indexerOutOfDate', { scope })}
      </Alert>
    )
  }
  if (outOfDateReason === 'blocks') {
    // Don't display lastUpdate. It's updating, but still many blocks behind.
    return (
      <Alert variant="warning-filled" sticky>
        {t('home.indexerOutOfDate', { scope })}
      </Alert>
    )
  }
  if (outOfDateReason === 'node') {
    return (
      <Alert variant="warning-filled" sticky>
        {t('home.nodeOutOfDateSince', { scope, lastUpdate })}
      </Alert>
    )
  }
  exhaustedTypeWarning('Unexpected outOfDateReason', outOfDateReason)
  return (
    <Alert variant="warning-filled" sticky>
      {t('home.indexerOutOfDate', { scope })}
    </Alert>
  )
}

export const ConsensusOfflineBanner: FC = () => {
  const scope = useRequiredScopeParam()
  const layerStatus = useConsensusFreshness(scope.network)

  return <OfflineBanner layerStatus={layerStatus} scope={scope} />
}

export const RuntimeOfflineBanner: FC = () => {
  const scope = useRuntimeScope()
  const layerStatus = useRuntimeFreshness(scope)

  return <OfflineBanner layerStatus={layerStatus} scope={scope} />
}
