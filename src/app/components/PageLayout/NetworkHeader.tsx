import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import Link from '@mui/material/Link'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { Circle } from '../Circle'
import { RouteUtils } from '../../utils/route-utils'
import { AppError, AppErrors } from '../../../types/errors'
import { Layer } from '../../../oasis-indexer/api'
import { LayerIcon } from '../../components/CustomIcons/LayerIcon'

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

    case Layer.consensus:
      return {
        header: t('common.consensus'),
        description: t('pageHeader.consensus'),
      }

    default:
      throw new AppError(AppErrors.UnsupportedLayer)
  }
}

export const NetworkHeader: FC<{ layer: Layer }> = ({ layer }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const content = getContent(t, layer)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {!isTablet && (
        <Circle color={COLORS.white} size={6} sx={{ mr: 4 }}>
          <LayerIcon sx={{ color: COLORS.brandExtraDark, fontSize: 33 }} />
        </Circle>
      )}

      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-start',
            flexWrap: 'no-wrap',
          }}
        >
          <Link
            component={RouterLink}
            to={RouteUtils.getDashboardRoute(layer)}
            sx={{ textDecoration: 'none' }}
          >
            <Typography
              variant="h2"
              color={COLORS.white}
              sx={{ pr: isTablet ? 3 : 4, fontSize: isTablet ? '16px' : '24px', fontWeight: 700 }}
            >
              {content.header}
            </Typography>
          </Link>

          <Box
            sx={theme => ({
              display: 'flex',
              flexDirection: 'row-reverse',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              height: theme.spacing(4),
              overflow: 'hidden',
            })}
          >
            <Circle color={COLORS.eucalyptus} size={4}>
              <CheckIcon sx={{ fontSize: 16, color: COLORS.white }} />
            </Circle>
            {!isTablet && (
              <Typography
                sx={theme => ({ height: theme.spacing(4), fontSize: 10, color: COLORS.ceil, mr: 3 })}
                component="span"
              >
                {t('common.paraTimeOnline')}
              </Typography>
            )}
          </Box>
        </Box>
        {!isTablet && (
          <Typography sx={{ fontSize: 12, lineHeight: '18px', color: COLORS.white }}>
            {content.description}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
