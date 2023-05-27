import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { useScopeParam } from '../../hooks/useScopeParam'
import { getNetworkNames, Network } from '../../../types/network'
import { useIsApiOffline } from './hook'

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
  const isNetworkOffline = useIsApiOffline(targetNetwork)
  const networkNames = getNetworkNames(t)
  const target = networkNames[targetNetwork]
  return isNetworkOffline ? (
    <StyledAlert severity="warning">{t('home.apiOffline', { target })}</StyledAlert>
  ) : null
}
