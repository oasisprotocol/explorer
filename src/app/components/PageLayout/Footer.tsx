import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export const Footer: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <footer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: isMobile ? 4 : 6, py: 5 }}>
        {process.env.REACT_APP_BUILD_SHA && (
          <Typography variant="footer">
            {t('version', { buildSha: process.env.REACT_APP_BUILD_SHA.substring(0, 7) })}
          </Typography>
        )}

        <Typography variant="footer">
          {isMobile ? t('footer.mobileTitle') : t('footer.title')} | 2022
        </Typography>
      </Box>
    </footer>
  )
}
