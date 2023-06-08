import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Collapse from '@mui/material/Collapse'
import { COLORS } from '../../../styles/theme/colors'
import { Network, getNetworkNames } from '../../../types/network'
import { RouteUtils } from '../../utils/route-utils'
import { getNetworkIcons } from '../../utils/content'

type NetworkMenuItemProps = Omit<NetworkMenuProps, 'options'> & {
  divider: boolean
  network: Network
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
  const activeNetworkSelection = network === activeNetwork

  return (
    <MenuItem
      divider={divider}
      onMouseEnter={() => {
        setHoveredNetwork(network)
        setSelectedNetwork(network)
      }}
      selected={activeNetworkSelection}
    >
      <ListItemIcon>{icons[network]}</ListItemIcon>
      <ListItemText>
        {labels[network]}
        {activeNetwork === network && (
          <Typography
            component="span"
            sx={{ fontSize: '10px', fontStyle: 'italic', color: COLORS.grayMedium, ml: 2 }}
          >
            {t('paraTimePicker.selected')}
          </Typography>
        )}
      </ListItemText>
      {network === selectedNetwork && <KeyboardArrowRightIcon />}
    </MenuItem>
  )
}

type NetworkMenuProps = {
  activeNetwork: Network
  hoveredNetwork?: Network
  selectedNetwork?: Network
  setHoveredNetwork: (network?: Network) => void
  setSelectedNetwork: (network: Network) => void
}

export const NetworkMenu: FC<NetworkMenuProps> = ({
  activeNetwork,
  hoveredNetwork,
  selectedNetwork,
  setHoveredNetwork,
  setSelectedNetwork,
}) => {
  const { t } = useTranslation()
  const [expandNetworkMenu, setExpandNetworkMenu] = useState(activeNetwork !== Network.mainnet)
  const options: Network[] = RouteUtils.getEnabledNetworks()

  const shouldAlwaysShow = (net: Network) =>
    net === Network.mainnet || net === activeNetwork || net === selectedNetwork
  const shouldSometimesHide = (net: Network) => !shouldAlwaysShow(net)

  const stableOptions = options.filter(shouldAlwaysShow)
  const filteredOptions = options.filter(shouldSometimesHide)

  return (
    <>
      <MenuList>
        {stableOptions.map((network, index) => (
          <NetworkMenuItem
            activeNetwork={activeNetwork}
            divider={index !== stableOptions.length - 1}
            key={network}
            hoveredNetwork={hoveredNetwork}
            selectedNetwork={selectedNetwork}
            setHoveredNetwork={setHoveredNetwork}
            setSelectedNetwork={setSelectedNetwork}
            network={network}
          />
        ))}
        <Collapse orientation="vertical" in={expandNetworkMenu}>
          {filteredOptions.map((network, index) => (
            <NetworkMenuItem
              activeNetwork={activeNetwork}
              divider={index !== filteredOptions.length - 1}
              hoveredNetwork={hoveredNetwork}
              key={network}
              network={network}
              selectedNetwork={selectedNetwork}
              setHoveredNetwork={setHoveredNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />
          ))}
        </Collapse>
      </MenuList>
      {!!filteredOptions.length && (
        <Button
          onClick={() => setExpandNetworkMenu(!expandNetworkMenu)}
          size="small"
          variant="text"
          sx={{ ml: '48px' }}
        >
          {expandNetworkMenu ? t('paraTimePicker.less') : t('paraTimePicker.more')}
        </Button>
      )}
    </>
  )
}
