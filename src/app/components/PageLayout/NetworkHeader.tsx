import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { Circle } from '../Circle'
import { AppError, AppErrors } from '../../../types/errors'
import { Layer } from '../../../oasis-indexer/api'
import Button from '@mui/material/Button'
import { LayerDetailsModal } from '../LayerDetailsModal'
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
  const [open, setOpen] = useState(false)

  const onLayerModalOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          py: isTablet ? 0 : 4,
          pl: isTablet ? 0 : 4,
          pr: isTablet ? 0 : 6,
          border: isTablet ? 'none' : `3px solid ${COLORS.white025A}`,
          borderRadius: isTablet ? 'none' : 3,
        }}
      >
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
              }}
            >
              <Button
                variant="text"
                onClick={onLayerModalOpen}
                sx={{
                  textTransform: 'capitalize',
                  '&&': { background: 'transparent' },
                  p: 0,
                  height: 'auto',
                }}
              >
                <Typography
                  variant="h2"
                  color={COLORS.white}
                  sx={{ pr: isTablet ? 3 : 4, fontSize: isTablet ? '16px' : '24px', fontWeight: 700 }}
                >
                  {content.header}
                </Typography>
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              >
                {!isTablet && (
                  <Typography sx={{ fontSize: 10, color: COLORS.ceil, mr: 3 }} component="span">
                    {t('common.paraTimeOnline')}
                  </Typography>
                )}
                <Circle color={COLORS.eucalyptus} size={4}>
                  <CheckIcon sx={{ fontSize: 16, color: COLORS.white }} />
                </Circle>
              </Box>
            </Box>
            {!isTablet && (
              <Typography sx={{ fontSize: 12, lineHeight: '18px', color: COLORS.white }}>
                {content.description}
              </Typography>
            )}
          </Box>

          {!isTablet && (
            <Button
              variant="text"
              color="inherit"
              sx={theme => ({
                padding: 0,
                marginLeft: 'auto',
                height: 'auto',
                textTransform: 'capitalize',
                position: 'absolute',
                top: theme.spacing(3),
                right: theme.spacing(2),
              })}
              onClick={onLayerModalOpen}
            >
              <Typography variant="body2" color={COLORS.white} sx={{ fontWeight: 700 }}>
                {t('common.change')}
              </Typography>
            </Button>
          )}
        </Box>
      </Box>
      <LayerDetailsModal open={open} setOpen={setOpen} />
    </>
  )
}
