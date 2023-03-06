import { FC } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import blockchainImage from './images/blockchain.svg'
import { COLORS } from '../../../styles/theme/colors'
import { Layer } from '../../../config'
import { Circle } from '../Circle'
import { RouteUtils } from '../../utils/route-utils'

const getHeader = (t: TFunction, layer: Layer) => {
  switch (layer) {
    case Layer.Emerald:
      return t('common.emerald')
    case Layer.Sapphire:
      return t('common.sapphire')
    default:
      return ''
  }
}

const getDescription = (t: TFunction, layer: Layer) => {
  switch (layer) {
    case Layer.Emerald:
      return t('pageHeader.emerald')
    case Layer.Sapphire:
      return t('pageHeader.sapphire')
    default:
      return ''
  }
}

export const NetworkHeader: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const layer = useParams().layer as Layer
  const header = getHeader(t, layer)

  return (
    <Box sx={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'flex-start', pr: isMobile ? 0 : 4 }}>
      {!isMobile && (
        <Circle color={COLORS.white} size={6} sx={{ mr: 4 }}>
          <img src={blockchainImage} alt={header} />
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
            to={RouteUtils.getDashboardRoute(Layer.Emerald)}
            sx={{ textDecoration: 'none' }}
          >
            <Typography
              variant="h2"
              color={COLORS.white}
              sx={{ pr: isMobile ? 3 : 4, fontSize: isMobile ? '16px' : '24px', fontWeight: 700 }}
            >
              {header}
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
          <Typography sx={{ fontSize: 12, lineHeight: '18px', color: COLORS.white }}>
            {getDescription(t, layer)}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
