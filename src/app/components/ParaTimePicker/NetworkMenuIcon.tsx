import { FC, ReactNode } from 'react'
import { Network } from '../../../types/network'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import { COLORS } from '../../../styles/theme/colors'
import { MainnetIcon } from '../CustomIcons/Mainnet'
import { TestnetIcon } from '../CustomIcons/Testnet'

const getIcons = (): Record<Network, ReactNode> => ({
  [Network.mainnet]: <MainnetIcon />,
  [Network.testnet]: <TestnetIcon />,
})

type NetworkMenuIconProps = {
  network: Network
}

export const NetworkMenuIcon: FC<NetworkMenuIconProps> = ({ network }) => {
  const icons = getIcons()

  return (
    <MenuList>
      <MenuItem divider sx={{ pointerEvents: 'none', color: COLORS.brandDark }}>
        <ListItemIcon>{icons[network]}</ListItemIcon>
      </MenuItem>
    </MenuList>
  )
}
