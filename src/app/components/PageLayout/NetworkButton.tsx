import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { getNetworkNames, Network } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { getLayerLabels } from '../../utils/content'
import { LayerStatus } from '../LayerStatus'
import { fixedLayer } from '../../utils/route-utils'
import { TFunction } from 'i18next'

type NetworkButtonProps = {
  isOutOfDate?: boolean
  layer: Layer
  network: Network
  onClick: () => void
}

const getNetworkButtonLabel = (t: TFunction, network: Network, layer: Layer) =>
  fixedLayer // If we are fixed to a layer,
    ? getNetworkNames(t)[network] // let's show the name of the network,
    : getLayerLabels(t)[layer] // otherwise, the name of the layer.

export const NetworkButton: FC<NetworkButtonProps> = ({ isOutOfDate, layer, network, onClick }) => {
  const { t } = useTranslation()

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onClick}
      className="flex justify-between items-center w-[223px] p-0 border-1 rounded-md text-left overflow-hidden
shadow-none gap-0
  focus-visible:ring-0 z-20"
    >
      <div className="flex w-full items-center gap-2 px-4">
        <LayerStatus isOutOfDate={isOutOfDate} />
        {getNetworkButtonLabel(t, network, layer)}
      </div>

      <div className="flex items-center justify-center h-10 px-3 border-l rounded-r-md">
        <ChevronDown className="w-5 h-5" />
      </div>
    </Button>
  )
}

export const MobileNetworkButton: FC<NetworkButtonProps> = ({ isOutOfDate, layer, network, onClick }) => {
  const { t } = useTranslation()

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 h-[30px] px-4 rounded-md font-medium shadow-none"
    >
      <LayerStatus isOutOfDate={isOutOfDate} />
      {getNetworkButtonLabel(t, network, layer)}
    </Button>
  )
}
