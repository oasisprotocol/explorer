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
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { orderByLayer } from '../../../types/layers'
import { useScreenSize } from '../../hooks/useScreensize'

type BaseLayerMenuItemProps = {
  divider: boolean
  layer: Layer
}

const LayerMenuItemCaption: FC<PropsWithChildren> = ({ children }) => (
  <Typography
    component="span"
    sx={{ fontSize: '10px', fontStyle: 'italic', color: COLORS.grayMedium, ml: 2 }}
  >
    {children}
  </Typography>
)

export const DisabledLayerMenuItem: FC<BaseLayerMenuItemProps> = ({ divider, layer }) => {
  const { isTablet } = useScreenSize()
  const { t } = useTranslation()
  const labels = getLayerLabels(t)

  return (
    <Tooltip arrow placement="top" title={t('paraTimePicker.comingSoonTitle')}>
      {/* Div is needed because we need an element with enabled pointer-events to make Tooltip work */}
      <div>
        <MenuItem disabled divider={divider}>
          <ListItemText>
            {labels[layer]}
            {isTablet && <LayerMenuItemCaption>{t('paraTimePicker.comingSoonLabel')}</LayerMenuItemCaption>}
          </ListItemText>
        </MenuItem>
      </div>
    </Tooltip>
  )
}

type LayerMenuItemProps = LayerMenuProps &
  BaseLayerMenuItemProps & {
    hoveredLayer?: Layer
    setHoveredLayer: (layer?: Layer) => void
  }

export const LayerMenuItem: FC<LayerMenuItemProps> = ({
  activeLayer,
  divider,
  layer,
  network,
  selectedLayer,
  selectedNetwork,
  setHoveredLayer,
  setSelectedLayer,
}) => {
  const { t } = useTranslation()
  const labels = getLayerLabels(t)
  const activeLayerSelection = layer === selectedLayer

  return (
    <MenuItem
      divider={divider}
      onMouseEnter={() => {
        setHoveredLayer(layer)
      }}
      onMouseLeave={() => {
        setHoveredLayer()
      }}
      onClick={() => {
        setSelectedLayer(layer)
      }}
      selected={activeLayerSelection}
    >
      <ListItemText>
        {labels[layer]}
        {selectedNetwork === network && activeLayer === layer && (
          <LayerMenuItemCaption>{t('paraTimePicker.selected')}</LayerMenuItemCaption>
        )}
      </ListItemText>
      {layer === selectedLayer && <KeyboardArrowRightIcon />}
    </MenuItem>
  )
}
type LayerMenuProps = {
  activeLayer: Layer
  network: Network
  selectedLayer?: Layer
  selectedNetwork: Network
  setSelectedLayer: (layer: Layer) => void
}

export const LayerMenu: FC<LayerMenuProps> = ({
  activeLayer,
  network,
  selectedLayer,
  selectedNetwork,
  setSelectedLayer,
}) => {
  const [hoveredLayer, setHoveredLayer] = useState<undefined | Layer>()
  const options = Object.values(Layer)
    .map(layer => ({
      layer,
      enabled: RouteUtils.getEnabledLayersForNetwork(selectedNetwork || network).includes(layer),
    }))
    .sort(orderByLayer)

  return (
    <MenuList>
      {options.map((option, index) => {
        if (!option.enabled) {
          return (
            <DisabledLayerMenuItem
              divider={index !== options.length - 1}
              key={option.layer}
              layer={option.layer}
            />
          )
        } else {
          return (
            <LayerMenuItem
              activeLayer={activeLayer}
              divider={index !== options.length - 1}
              hoveredLayer={hoveredLayer}
              key={option.layer}
              layer={option.layer}
              network={network}
              selectedLayer={selectedLayer}
              selectedNetwork={selectedNetwork}
              setHoveredLayer={setHoveredLayer}
              setSelectedLayer={setSelectedLayer}
            />
          )
        }
      })}
    </MenuList>
  )
}
