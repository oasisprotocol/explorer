import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import logotype from './images/logo.svg'
import { COLORS } from '../../../styles/theme/colors'

export const Logotype: FC = () => {
  const { t } = useTranslation()
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
      <img src={logotype} alt="logo" height={40} width={40} />
      <Typography variant="h1" color={COLORS.white}>
        {t('pageTitle')}
      </Typography>
    </Link>
  )
}
