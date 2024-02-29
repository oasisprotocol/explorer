import { FC } from 'react'
import Link from '@mui/material/Link'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import pontusXIcon from '../CustomIcons/pontusx.svg'
import Typography from '@mui/material/Typography'
import { getAppTitle } from '../../../config'

interface LogotypeProps {
  color?: string
  showText: boolean
}

export const HomePageLink: FC<LogotypeProps> = ({ color, showText }) => {
  return (
    <Link to="/" component={RouterLink} sx={{ display: 'inline-flex' }}>
      <Logotype color={color} showText={showText} />
    </Link>
  )
}

export const Logotype: FC<LogotypeProps> = ({ color, showText }) => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()
  const logoSize = isMobile ? 32 : 40

  return (
    <Box
      sx={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: color || theme.palette.layout.main,
      }}
    >
      <img src={pontusXIcon} alt="Pontus-X logo" width={logoSize} />
      {showText && (
        <Typography variant="h1" color={color || theme.palette.layout.main} sx={{ whiteSpace: 'nowrap' }}>
          {getAppTitle()}
        </Typography>
      )}
    </Box>
  )
}
