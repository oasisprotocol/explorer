import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { PontusxIcon } from '../CustomIcons/PontusxIcon'
import pontusxIcon from '../CustomIcons/pontusx_horizontal_white.svg'

interface LogotypeProps {
  color?: string
  showText: boolean
}

export const HomePageLink: FC<LogotypeProps> = ({ color, showText }) => {
  const { t } = useTranslation()

  return (
    <Link
      aria-label={t('home.link')}
      to="/"
      component={RouterLink}
      sx={{ display: 'inline-flex', textDecoration: 'none' }}
    >
      <Logotype color={color} showText={showText} />
    </Link>
  )
}

export const Logotype: FC<LogotypeProps> = ({ color, showText }) => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()
  const oasisLogoSize = isMobile ? 32 : 40

  const logoSize = !showText ? { height: oasisLogoSize, width: oasisLogoSize } : { height: 58, width: 228 }
  return (
    <Box
      sx={{
        color: color || theme.palette.layout.main,
      }}
    >
      {!showText ? (
        <PontusxIcon sx={logoSize} />
      ) : (
        <img src={pontusxIcon} width={logoSize.width} alt="Pontus-X Logo" />
      )}
    </Box>
  )
}
