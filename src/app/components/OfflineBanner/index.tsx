import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { useRequiredScopeParam, useScopeParam } from '../../hooks/useScopeParam'
import { getNetworkNames, Network } from '../../../types/network'
import { useIsApiReachable, useRuntimeFreshness } from './hook'
import { getNameForScope } from '../../../types/searchScope'
import { exhaustedTypeWarning } from '../../../types/errors'

const StyledAlert = styled(Alert)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  justifyContent: 'center',
  borderRadius: 0,
  fontSize: '12px',
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(4)}} 0`,
  },
  [theme.breakpoints.up('md')]: {
    padding: `${theme.spacing(3)}} 0`,
  },
}))

export const NetworkOfflineBanner: FC<{ wantedNetwork?: Network }> = ({ wantedNetwork }) => {
  const scope = useScopeParam()
  const { t } = useTranslation()
  const targetNetwork = wantedNetwork || scope?.network || Network.mainnet
  const isNetworkReachable = useIsApiReachable(targetNetwork)
  const networkNames = getNetworkNames(t)
  const target = networkNames[targetNetwork]
  if (!isNetworkReachable.reachable) {
    if (isNetworkReachable.reason === 'userOffline') {
      return <StyledAlert severity="warning">{t('home.userOffline', { target })}</StyledAlert>
    }
    if (isNetworkReachable.reason === 'apiOffline') {
      return <StyledAlert severity="warning">{t('home.apiOffline', { target })}</StyledAlert>
    }
    exhaustedTypeWarning('Unexpected isNetworkReachable reason', isNetworkReachable.reason)
  }
  return null
}

export const RuntimeOfflineBanner: FC = () => {
  const scope = useRequiredScopeParam()
  const { t } = useTranslation()

  const { outOfDate, lastUpdate } = useRuntimeFreshness(scope)
  if (!outOfDate) return null
  const target = getNameForScope(t, scope)
  return (
    <StyledAlert severity="warning">
      {lastUpdate
        ? t('home.runtimeOutOfDateSince', { target, lastUpdate })
        : t('home.runtimeOutOfDate', { target })}
    </StyledAlert>
  )
}
