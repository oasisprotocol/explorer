import { FC } from 'react'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { OasisIcon } from '../CustomIcons/OasisIcon'
import { ExplorerIcon } from '../CustomIcons/ExplorerIcon'

interface LogotypeProps {
  color?: string
  showText: boolean
}

export const HomePageLink: FC<LogotypeProps> = ({ color, showText }) => {
  return (
    <Link to="/" component={RouterLink} sx={{ display: 'inline-flex', textDecoration: 'none' }}>
      <Logotype color={color} showText={showText} />
    </Link>
  )
}

export const Logotype: FC<LogotypeProps> = ({ color, showText }) => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()
  const oasisLogoSize = isMobile ? 32 : 40
  const logoSize = !showText ? { height: oasisLogoSize, width: oasisLogoSize } : { height: 40, width: 210 }

  return (
    <Box
      sx={{
        color: color || theme.palette.layout.main,
      }}
    >
      {!showText ? <OasisIcon sx={logoSize} /> : <ExplorerIcon sx={logoSize} />}
    </Box>
  )
}
