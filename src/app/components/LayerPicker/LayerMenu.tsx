import { FC, PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import { COLORS } from '../../../styles/theme/colors'
import { Layer } from '../../../oasis-nexus/api'
import { getLayerLabels } from '../../utils/content'
import { isScopeHidden, mergeNetworksInLayerSelector, RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { orderByLayer } from '../../../types/layers'
import { useScreenSize } from '../../hooks/useScreensize'
import { useScopeParam } from '../../hooks/useScopeParam'
import { SearchScope } from '../../../types/searchScope'

type BaseLayerMenuItemProps = {
  divider: boolean
  targetScope: SearchScope
}

const LayerMenuItemCaption: FC<PropsWithChildren> = ({ children }) => (
  <Typography
    component="span"
    sx={{ fontSize: '10px', fontStyle: 'italic', color: COLORS.grayMedium, ml: 2 }}
  >
    {children}
  </Typography>
)

export const DisabledLayerMenuItem: FC<BaseLayerMenuItemProps> = ({ divider, targetScope }) => {
  const { isTablet } = useScreenSize()
  const { t } = useTranslation()
  const labels = getLayerLabels(t)

  return (
    <Tooltip arrow placement="top" title={t('layerPicker.comingSoonTitle')}>
      {/* Div is needed because we need an element with enabled pointer-events to make Tooltip work */}
      <div>
        <MenuItem disabled divider={divider}>
          <ListItemText>
            {labels[targetScope.layer]}
            {isTablet && <LayerMenuItemCaption>{t('layerPicker.comingSoonLabel')}</LayerMenuItemCaption>}
          </ListItemText>
        </MenuItem>
      </div>
    </Tooltip>
  )
}

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
      tabIndex={isSelected ? 0 : -1}
    >
      <ListItemText>
        {labels[targetScope.layer]}
        {isActive && <LayerMenuItemCaption>{t('layerPicker.active')}</LayerMenuItemCaption>}
      </ListItemText>
      {isSelected && <KeyboardArrowRightIcon />}
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
    <MenuList>
      {options.map((option, index) => {
        if (!option.enabled) {
          if (selectedNetwork === 'localnet') return null
          return (
            <DisabledLayerMenuItem
              divider={index !== options.length - 1}
              key={option.scope.network + option.scope.layer}
              targetScope={option.scope}
            />
          )
        } else {
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
        }
      })}
    </MenuList>
  )
}
