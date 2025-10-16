import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import { NetworkButton, MobileNetworkButton } from './NetworkButton'
import { Network, getNetworkNames } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { LayerPicker } from './../LayerPicker'
import { fixedLayer, fixedNetwork, RouteUtils } from '../../utils/route-utils'
import { useConsensusFreshness, useRuntimeFreshness } from '../OfflineBanner/hook'
import { RuntimeScope, SearchScope } from '../../../types/searchScope'
import { useLocalSettings } from '../../hooks/useLocalSettings'

type NetworkSelectorProps = {
  layer: Layer
  network: Network
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ network, layer }) => {
  return layer === 'consensus' ? (
    <ConsensusNetworkSelector network={network} layer={layer} />
  ) : (
    <RuntimeNetworkSelector network={network} layer={layer} />
  )
}

const ConsensusNetworkSelector: FC<NetworkSelectorProps> = ({ layer, network }) => {
  const { outOfDate } = useConsensusFreshness(network)

  return <NetworkSelectorView layer={layer} network={network} isOutOfDate={outOfDate} />
}

const RuntimeNetworkSelector: FC<RuntimeScope> = ({ layer, network }) => {
  const { outOfDate } = useRuntimeFreshness({ network, layer })

  return <NetworkSelectorView layer={layer} network={network} isOutOfDate={outOfDate} />
}

type NetworkSelectorViewProps = NetworkSelectorProps & {
  isOutOfDate: boolean | undefined
}

const NetworkSelectorView: FC<NetworkSelectorViewProps> = ({ isOutOfDate, layer, network }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isMobile, isTablet } = useScreenSize()
  const labels = getNetworkNames(t)
  const [openDrawer, setOpenDrawer] = useState(false)
  const { changeSetting } = useLocalSettings()
  const handleDrawerClose = () => setOpenDrawer(false)
  const handleDrawerOpen = () => setOpenDrawer(true)

  return (
    <div className="flex items-center justify-center md:justify-end">
      <LayerPicker
        open={openDrawer}
        onClose={handleDrawerClose}
        onConfirm={(scope: SearchScope) => {
          handleDrawerClose()
          changeSetting('preferredScope', scope)
          navigate(RouteUtils.getDashboardRoute(scope))
        }}
        isOutOfDate={isOutOfDate}
      />
      {!isMobile && (
        <NetworkButton isOutOfDate={isOutOfDate} layer={layer} network={network} onClick={handleDrawerOpen} />
      )}
      {!fixedNetwork && !fixedLayer && !isTablet && network !== 'mainnet' && (
        <div className="flex z-10 -ml-0.5 border border-l-0 border-black pr-2 py-1 pl-1 rounded-r-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]">
          <span className="text-xs text-foreground whitespace-nowrap">
            {t('pageHeader.ribbon', {
              network: labels[network],
            })}
          </span>
        </div>
      )}
      {isMobile && (
        <MobileNetworkButton
          isOutOfDate={isOutOfDate}
          network={network}
          layer={layer}
          onClick={handleDrawerOpen}
        />
      )}
    </div>
  )
}
