import { FC, PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import { Layer } from '../../../oasis-nexus/api'
import { getLayerLabels } from '../../utils/content'
import { isScopeHidden, mergeNetworksInLayerSelector, RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { orderByLayer } from '../../../types/layers'
import { useScopeParam } from '../../hooks/useScopeParam'
import { SearchScope } from '../../../types/searchScope'
import { MenuItem } from '../LayerPicker/MenuItem'

type BaseLayerMenuItemProps = {
  divider: boolean
  targetScope: SearchScope
}

const LayerMenuItemCaption: FC<PropsWithChildren> = ({ children }) => (
  <span className="text-[10px] italic text-muted-foreground ml-1">{children}</span>
)

type LayerMenuItemProps = LayerMenuProps &
  BaseLayerMenuItemProps & {
    hoveredScope?: SearchScope
    setHoveredScope: (scope?: SearchScope) => void
  }

export const LayerMenuItem: FC<LayerMenuItemProps> = ({
  divider,
  targetScope,
  selectedScope,
  setHoveredScope,
  setSelectedScope,
}) => {
  const { t } = useTranslation()
  const labels = getLayerLabels(t)
  const activeScope = useScopeParam()!
  const isSelected =
    targetScope.network === selectedScope?.network && targetScope.layer === selectedScope?.layer
  const isActive = targetScope.network === activeScope.network && targetScope.layer === activeScope.layer

  return (
    <MenuItem
      divider={divider}
      onMouseEnter={() => {
        setHoveredScope(targetScope)
      }}
      onMouseLeave={() => {
        setHoveredScope()
      }}
      onClick={() => {
        setSelectedScope(targetScope)
      }}
      selected={isSelected}
    >
      <div className="flex-auto">
        {labels[targetScope.layer]}
        {isActive && <LayerMenuItemCaption>{t('layerPicker.active')}</LayerMenuItemCaption>}
      </div>
      {isSelected && <ChevronRight size={20} />}
    </MenuItem>
  )
}
type LayerMenuProps = {
  selectedNetwork?: Network
  selectedScope?: SearchScope
  setSelectedScope: (scope: SearchScope) => void
}

type LayerMenuOption = {
  scope: SearchScope
  enabled: boolean
}

const getOptionsForNetwork = (network: Network, activeScope?: SearchScope | undefined): LayerMenuOption[] =>
  Object.values(Layer)
    .sort(orderByLayer)
    // Don't show hidden layers, unless we are already viewing them.
    .filter(
      layer =>
        !isScopeHidden({ network, layer }) ||
        (layer === activeScope?.layer && network === activeScope?.network),
    )
    .map(layer => ({
      scope: {
        network,
        layer,
      },
      enabled: RouteUtils.getAllLayersForNetwork(network).enabled.includes(layer),
    }))

export const LayerMenu: FC<LayerMenuProps> = ({ selectedNetwork, selectedScope, setSelectedScope }) => {
  const activeScope = useScopeParam()!
  const [hoveredScope, setHoveredScope] = useState<undefined | SearchScope>()
  const options = mergeNetworksInLayerSelector
    ? RouteUtils.getVisibleScopes(activeScope).map(scope => ({ scope, enabled: true }))
    : getOptionsForNetwork(selectedNetwork ?? activeScope.network, activeScope)

  return (
    <ul role="menu">
      {options.map((option, index) => {
        if (!option.enabled) return null
        return (
          <LayerMenuItem
            divider={index !== options.length - 1}
            hoveredScope={hoveredScope}
            key={option.scope.network + option.scope.layer}
            targetScope={option.scope}
            selectedScope={selectedScope}
            selectedNetwork={selectedNetwork}
            setHoveredScope={setHoveredScope}
            setSelectedScope={setSelectedScope}
          />
        )
      })}
    </ul>
  )
}
