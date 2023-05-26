import { FC } from 'react'
import { Network } from '../../../types/network'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import { COLORS } from '../../../styles/theme/colors'
import { getNetworkIcons } from '../../utils/content'

type NetworkMenuIconProps = {
  network: Network
}

export const NetworkMenuIcon: FC<NetworkMenuIconProps> = ({ network }) => {
  const icons = getNetworkIcons()

  return (
    <MenuList>
      <MenuItem divider sx={{ pointerEvents: 'none', color: COLORS.brandDark }}>
        <ListItemIcon>{icons[network]}</ListItemIcon>
      </MenuItem>
    </MenuList>
  )
}
