import { FC, Fragment } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { RouteUtils } from '../../utils/route-utils'
import { COLORS } from '../../../styles/theme/colors'
import { Circle } from '../Circle'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'react-i18next'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useLayerParam } from '../../hooks/useLayerParam'
import { BlockchainIcon } from '../BlockchainIcon'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import { Layer } from 'oasis-indexer/api'
import { TFunction } from 'i18next'
import { Modal } from '../Modal'

const CloseModalIconButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(4),
  },
}))

const EnabledLayersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'fit-content(70%) 1fr',
    rowGap: theme.spacing(5),
  },
}))

const SelectButton = styled(Button)(() => ({
  color: COLORS.brandExtraDark,
  textTransform: 'capitalize',
  fontWeight: 700,
  fontSize: '16px',
  '&&': {
    backgroundColor: 'transparent',
  },
  '&:disabled': {
    color: COLORS.brandDark,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
}))

interface LayerDetailsModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const getLabels = (t: TFunction): { [key in Layer]: { title?: string; description?: string } } => ({
  emerald: {
    title: t('common.emerald'),
    description: t('pageHeader.emerald'),
  },
  sapphire: {
    title: t('common.sapphire'),
    description: t('pageHeader.sapphire'),
  },
  consensus: {},
  cipher: {},
})

export const LayerDetailsModal: FC<LayerDetailsModalProps> = ({ open, setOpen }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const enabledLayers = RouteUtils.getEnabledLayers()
  const activeLayer = useLayerParam()
  const labels = getLabels(t)

  const onModalClose = () => {
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={onModalClose}
      aria-labelledby="paratime-details-modal-title"
      aria-describedby="paratime-details-modal-description"
      hideBackdrop={false}
    >
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography id="paratime-details-modal-title" component="h3" variant="h3">
            {t('layerPickerModal.title')}
          </Typography>

          <CloseModalIconButton aria-label={'close'} onClick={onModalClose}>
            <HighlightOffIcon fontSize="large" sx={{ color: COLORS.brandExtraDark }} />
          </CloseModalIconButton>
        </Box>

        <Typography id="paratime-details-modal-description" variant="body2" sx={{ mb: 5 }}>
          {t('layerPickerModal.description')}
        </Typography>
        <EnabledLayersGrid>
          {enabledLayers.map(layer => (
            <Fragment key={layer}>
              <Box sx={{ display: 'flex' }}>
                <Circle color={COLORS.white} size={6} sx={{ mr: 4 }}>
                  <BlockchainIcon selected={activeLayer === layer} />
                </Circle>
                <Box
                  key={layer}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isMobile ? 'space-between' : 'flex-start',
                    }}
                  >
                    <Typography
                      variant="h2"
                      color={COLORS.brandExtraDark}
                      sx={{
                        pr: isMobile ? 3 : 4,
                        fontSize: '24px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                      }}
                    >
                      {labels[layer].title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: 10, color: COLORS.ceil, mr: 3 }} component="span">
                        {t('common.paraTimeOnline')}
                      </Typography>
                      <Circle color={COLORS.eucalyptus} size={4}>
                        <CheckIcon sx={{ fontSize: 16, color: COLORS.white }} />
                      </Circle>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography component="span" variant="caption">
                      {labels[layer].description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  mb: isMobile ? 5 : 0,
                }}
              >
                <Link
                  component={RouterLink}
                  to={RouteUtils.getDashboardRoute(layer)}
                  sx={{
                    textDecoration: 'none',
                  }}
                >
                  <SelectButton variant="text" onClick={() => setOpen(false)}>
                    {activeLayer === layer ? t('common.active') : t('common.select')}
                  </SelectButton>
                </Link>
              </Box>
            </Fragment>
          ))}
        </EnabledLayersGrid>
      </>
    </Modal>
  )
}
