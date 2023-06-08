import { FC, forwardRef, ForwardRefRenderFunction } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { useRequiredScopeParam, useScopeParam } from '../../hooks/useScopeParam'
import { getNetworkNames, Network } from '../../../types/network'
import { useIsApiOffline, useRuntimeFreshness } from './hook'
import { getNameForScope } from '../../../types/searchScope'

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

const NetworkOfflineBannerCmp: ForwardRefRenderFunction<Alert | null, { wantedNetwork?: Network }> = (
  { wantedNetwork },
  ref,
) => {
  const scope = useScopeParam()
  const { t } = useTranslation()
  const targetNetwork = wantedNetwork || scope?.network || Network.mainnet
  const isNetworkOffline = useIsApiOffline(targetNetwork)
  const networkNames = getNetworkNames(t)
  const target = networkNames[targetNetwork]
  return isNetworkOffline ? (
    <StyledAlert ref={ref} severity="warning">
      {t('home.apiOffline', { target })}
    </StyledAlert>
  ) : null
}

export const NetworkOfflineBanner = forwardRef(NetworkOfflineBannerCmp)

const RuntimeOfflineBannerCmp: ForwardRefRenderFunction<Alert | null> = (_, ref) => {
  const scope = useRequiredScopeParam()
  const { t } = useTranslation()

  const { outOfDate, lastUpdate } = useRuntimeFreshness(scope)
  if (!outOfDate) return null
  const target = getNameForScope(t, scope)
  return (
    <StyledAlert ref={ref} severity="warning">
      {lastUpdate
        ? t('home.runtimeOutOfDateSince', { target, lastUpdate })
        : t('home.runtimeOutOfDate', { target })}
    </StyledAlert>
  )
}

export const RuntimeOfflineBanner = forwardRef(RuntimeOfflineBannerCmp)
