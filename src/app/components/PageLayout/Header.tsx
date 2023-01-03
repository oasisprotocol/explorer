import { FC } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Logotype } from './Logotype'
import { NetworkHeader } from './NetworkHeader'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

export const Header: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <header>
      <Grid container sx={{ px: isMobile ? 4 : 6, pb: isMobile ? 4 : 5 }}>
        <Grid md={12} xs={6} sx={{ pb: isMobile ? 0 : '50px' }}>
          <Logotype>
            <Typography variant="h1" color={COLORS.white}>
              {t('pageTitle')}
            </Typography>
          </Logotype>
        </Grid>
        <Grid xs={6} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <NetworkHeader />
        </Grid>
        <Grid xs={8}>{/* Search Placeholder */}</Grid>
      </Grid>
    </header>
  )
}
