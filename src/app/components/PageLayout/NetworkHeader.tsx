import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import blockchainImage from './images/blockchain.svg'
import { COLORS } from '../../../styles/theme/colors'
import { ParaTime } from '../../../config'
import { Circle } from '../Circle'
import { RouteUtils } from '../../utils/route-utils'

const getLabel = (t: TFunction, pathname: string) => {
  if (pathname.startsWith(`/${ParaTime.Emerald}`)) {
    return t('common.emerald')
  }
}

export const NetworkHeader: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { pathname } = useLocation()
  const label = getLabel(t, pathname)

  return (
    <Box sx={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'flex-start', pr: isMobile ? 0 : 4 }}>
      {!isMobile && (
        <Circle color={COLORS.white} size={6} sx={{ mr: 4 }}>
          <img src={blockchainImage} alt={label} />
        </Circle>
      )}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link
            component={RouterLink}
            to={RouteUtils.getDashboardRoute(ParaTime.Emerald)}
            sx={{ textDecoration: 'none' }}
          >
            <Typography
              variant="h2"
              color={COLORS.white}
              sx={{ pr: isMobile ? 3 : 4, fontSize: isMobile ? '16px' : '24px' }}
            >
              {label}
            </Typography>
          </Link>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!isMobile && (
              <Typography sx={{ fontSize: 10, color: COLORS.ceil, mr: 3 }} component="span">
                {t('pageHeader.status')}
              </Typography>
            )}
            <Circle color={COLORS.eucalyptus} size={4}>
              <CheckIcon sx={{ fontSize: 16, color: COLORS.white }} />
            </Circle>
          </Box>
        </Box>
        {!isMobile && (
          <Typography sx={{ fontSize: 11, color: COLORS.white }}>{t('pageHeader.emerald')}</Typography>
        )}
      </Box>
    </Box>
  )
}
