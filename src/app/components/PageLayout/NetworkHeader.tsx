import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
import { AppError, AppErrors } from '../../../types/errors'

const getContent = (t: TFunction, layer: Layer) => {
  switch (layer) {
    case Layer.emerald:
      return {
        header: t('common.emerald'),
        description: t('pageHeader.emerald'),
      }

    case Layer.sapphire:
      return {
        header: t('common.sapphire'),
        description: t('pageHeader.sapphire'),
      }
    default:
      throw new AppError(AppErrors.UnsupportedLayer)
  }
}

export const NetworkHeader: FC<{ layer: Layer }> = ({ layer }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const content = getContent(t, layer)

  return (
    <Box sx={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'flex-start', pr: isMobile ? 0 : 4 }}>
      {!isMobile && (
        <Circle color={COLORS.white} size={6} sx={{ mr: 4 }}>
          <img src={blockchainImage} alt={content.header} />
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
            to={RouteUtils.getDashboardRoute(Layer.emerald)}
            sx={{ textDecoration: 'none' }}
          >
            <Typography
              variant="h2"
              color={COLORS.white}
              sx={{ pr: isMobile ? 3 : 4, fontSize: isMobile ? '16px' : '24px', fontWeight: 700 }}
            >
              {content.header}
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
                {t('common.paraTimeOnline')}
              </Typography>
            )}
            <Circle color={COLORS.eucalyptus} size={4}>
              <CheckIcon sx={{ fontSize: 16, color: COLORS.white }} />
            </Circle>
          </Box>
        </Box>
        {!isMobile && (
          <Typography sx={{ fontSize: 12, lineHeight: '18px', color: COLORS.white }}>
            {content.description}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
