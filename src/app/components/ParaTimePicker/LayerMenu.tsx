import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import { COLORS } from '../../../styles/theme/colors'
import { Layer } from '../../../oasis-indexer/api'
import { getLayerLabels } from '../../utils/content'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'

type BaseLayerMenuItemProps = {
  divider: boolean
  layer: Layer
}

export const DisabledLayerMenuItem: FC<BaseLayerMenuItemProps> = ({ divider, layer }) => {
  const { t } = useTranslation()
  const labels = getLayerLabels(t)

  return (
    <Tooltip arrow placement="top" title={'Coming soon'}>
      {/* Div is needed because we need an element with enabled pointer-events to make Tooltip work */}
      <div>
        <MenuItem disabled divider={divider}>
          <ListItemText>{labels[layer]}</ListItemText>
        </MenuItem>
      </div>
    </Tooltip>
  )
}

type BaseLayerMenuProps = {
  activeLayer: Layer
  hoveredLayer?: Layer
  selectedLayer?: Layer
  setHoveredLayer: (layer?: Layer) => void
  setSelectedLayer: (layer?: Layer) => void
}

type LayerMenuItemProps = BaseLayerMenuProps & BaseLayerMenuItemProps

export const LayerMenuItem: FC<LayerMenuItemProps> = ({
  activeLayer,
  divider,
  hoveredLayer,
  layer,
  selectedLayer,
  setHoveredLayer,
  setSelectedLayer,
}) => {
  const { t } = useTranslation()
  const labels = getLayerLabels(t)

  return (
    <MenuItem
      divider={divider}
      onMouseEnter={() => {
        if (layer !== selectedLayer) {
          setSelectedLayer(undefined)
        }
        setHoveredLayer(layer)
      }}
      onClick={() => setSelectedLayer(layer)}
    >
      <ListItemText>
        {labels[layer]}
        <Typography
          component="span"
          sx={{ fontSize: '10px', fontStyle: 'italic', color: COLORS.grayMedium, ml: 2 }}
        >
          {activeLayer === layer && t('paraTimePicker.selected')}
        </Typography>
      </ListItemText>
      {hoveredLayer === layer && <KeyboardArrowRightIcon />}
    </MenuItem>
  )
}
type LayerMenuProps = BaseLayerMenuProps & {
  selectedNetwork: Network
}

const menuSortOrder: Record<Layer, number> = {
  [Layer.consensus]: 1,
  [Layer.emerald]: 2,
  [Layer.sapphire]: 3,
  [Layer.cipher]: 4,
}

export const LayerMenu: FC<LayerMenuProps> = ({
  activeLayer,
  hoveredLayer,
  selectedLayer,
  selectedNetwork,
  setHoveredLayer,
  setSelectedLayer,
}) => {
  const options = Object.values(Layer)
    .map(layer => ({
      layer,
      enabled: RouteUtils.getEnabledLayersForNetwork(selectedNetwork).includes(layer),
    }))
    .sort((a, b) => menuSortOrder[a.layer] - menuSortOrder[b.layer])

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
              selectedLayer={selectedLayer}
              setHoveredLayer={setHoveredLayer}
              setSelectedLayer={setSelectedLayer}
            />
          )
        }
      })}
    </MenuList>
  )
}
