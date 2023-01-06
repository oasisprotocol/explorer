import { FC } from 'react'
import Link from '@mui/material/Link'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import logotype from './images/logo.svg'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'

export const Logotype: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
      }}
    >
      <>
        <img src={logotype} alt="logo" height={logoSize} width={logoSize} />
        {!isMobile && (
          <Typography variant="h1" color={COLORS.white}>
            {t('pageTitle')}
          </Typography>
        )}
      </>
    </Link>
  )
}
