import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { COLORS } from '../../../styles/theme/colors'
import { Network, getNetworkNames } from '../../../types/network'
import { RouteUtils } from '../../utils/route-utils'
import { getNetworkIcons } from '../../utils/content'
import { MenuItem } from '../LayerPicker/MenuItem'

type NetworkMenuItemProps = Omit<NetworkMenuProps, 'options'> & {
  divider: boolean
  network: Network
  hoveredNetwork?: Network
  setHoveredNetwork: (network?: Network) => void
}

export const NetworkMenuItem: FC<NetworkMenuItemProps> = ({
  activeNetwork,
  divider,
  network,
  selectedNetwork,
  setHoveredNetwork,
  setSelectedNetwork,
}) => {
  const { t } = useTranslation()
  const labels = getNetworkNames(t)
  const icons = getNetworkIcons()
  const isSelected = network === selectedNetwork
  const isActive = network === activeNetwork

  return (
    <MenuItem
      divider={divider}
      onMouseEnter={() => {
        setHoveredNetwork(network)
      }}
      onMouseLeave={() => {
        setHoveredNetwork(undefined)
      }}
      onClick={() => {
        setSelectedNetwork(network)
      }}
      selected={isSelected}
    >
      <div className="min-w-9 shrink-0 inline-flex text-inherit">{icons[network]}</div>
      <div className="flex-auto">
        {labels[network]}
        {isActive && (
          <Typography
            component="span"
            sx={{ fontSize: '10px', fontStyle: 'italic', color: COLORS.grayMedium, ml: 2 }}
          >
            {t('layerPicker.active')}
          </Typography>
        )}
      </div>
      {network === selectedNetwork && <KeyboardArrowRightIcon />}
    </MenuItem>
  )
}

type NetworkMenuProps = {
  activeNetwork: Network
  selectedNetwork?: Network
  setSelectedNetwork: (network: Network) => void
}

export const NetworkMenu: FC<NetworkMenuProps> = ({ activeNetwork, selectedNetwork, setSelectedNetwork }) => {
  const [hoveredNetwork, setHoveredNetwork] = useState<undefined | Network>()
  const options: Network[] = RouteUtils.getEnabledNetworks()

  return (
    <ul role="menu">
      {options.map((network, index) => (
        <NetworkMenuItem
          activeNetwork={activeNetwork}
          divider={index !== options.length - 1}
          key={network}
          hoveredNetwork={hoveredNetwork}
          selectedNetwork={selectedNetwork}
          setHoveredNetwork={setHoveredNetwork}
          setSelectedNetwork={setSelectedNetwork}
          network={network}
        />
      ))}
    </ul>
  )
}
