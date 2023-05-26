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

type LayerMenuItemProps = LayerMenuProps & BaseLayerMenuItemProps

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
    <>
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
    </>
  )
}

type LayerMenuProps = {
  activeLayer: Layer
  hoveredLayer?: Layer
  selectedLayer?: Layer
  setHoveredLayer: (layer?: Layer) => void
  setSelectedLayer: (layer?: Layer) => void
}

export const LayerMenu: FC<LayerMenuProps> = ({
  activeLayer,
  hoveredLayer,
  selectedLayer,
  setHoveredLayer,
  setSelectedLayer,
}) => {
  const options = [
    { layer: Layer.consensus, enabled: false },
    { layer: Layer.emerald, enabled: true },
    { layer: Layer.sapphire, enabled: true },
    { layer: Layer.cipher, enabled: false },
  ]

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
