import { FC } from 'react'
import Link from '@mui/material/Link'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { OasisIcon } from '../CustomIcons/OasisIcon'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

interface LogotypeProps {
  color?: string
  showText?: true
}

export const Logotype: FC<LogotypeProps> = ({ color, showText }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showTypography = showText ?? !isMobile
  const logoSize = isMobile ? 32 : 40

  return (
    <Link
      to="/"
      component={RouterLink}
      sx={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: color || theme.palette.layout.main,
      }}
    >
      <OasisIcon sx={{ fontSize: logoSize }} />
      {showTypography && (
        <Typography variant="h1" color={color || theme.palette.layout.main} sx={{ whiteSpace: 'nowrap' }}>
          {t('pageTitle')}
        </Typography>
      )}
    </Link>
  )
}
