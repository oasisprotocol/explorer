import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button, { buttonClasses } from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { Network } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { getLayerLabels, getNetworkIcons } from '../../utils/content'
import { LayerStatus } from '../LayerStatus'

export const StyledNetworkButton = styled(Button)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 'auto',
  width: '280px',
  padding: 0,
  borderRadius: '12px',
  borderColor: theme.palette.layout.darkBorder,
  borderWidth: theme.spacing(1),
  backgroundColor: COLORS.white,
  color: COLORS.brandDark,
  textAlign: 'left',
  overflow: 'hidden',

  [`& .${buttonClasses.startIcon}`]: {
    transitionProperty: 'background-color, color',
    transitionDuration: `${theme.transitions.duration.standard}ms`,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    padding: `0 ${theme.spacing(4)}`,
    margin: 0,
  },

  [`& .${buttonClasses.endIcon}`]: {
    transitionProperty: 'background-color, color',
    transitionDuration: `${theme.transitions.duration.standard}ms`,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    height: '47px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${theme.spacing(4)}`,
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    borderLeftWidth: theme.spacing(1),
    borderLeftStyle: 'solid',
    borderLeftColor: theme.palette.layout.secondary,
    backgroundColor: COLORS.white,
  },

  '&:hover, &:focus-visible': {
    borderWidth: theme.spacing(1),
    color: COLORS.white,
    borderColor: theme.palette.layout.hoverBorder,

    [`& .${buttonClasses.endIcon}`]: {
      color: COLORS.brandDark,
      backgroundColor: theme.palette.layout.secondaryBackground,
      borderColor: theme.palette.layout.hoverBorder,
    },
  },
}))

export const StyledBox = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}))

type NetworkButtonProps = {
  isOutOfDate?: boolean
  layer: Layer
  network: Network
  onClick: () => void
}

export const NetworkButton: FC<NetworkButtonProps> = ({ isOutOfDate, layer, network, onClick }) => {
  const { t } = useTranslation()
  const labels = getLayerLabels(t)
  const icons = getNetworkIcons()

  return (
    <StyledNetworkButton
      sx={{ ml: 4 }}
      size="small"
      variant="outlined"
      startIcon={icons[network]}
      endIcon={<EditIcon />}
      onClick={onClick}
    >
      <StyledBox>
        {labels[layer]}
        <LayerStatus isOutOfDate={isOutOfDate} />
      </StyledBox>
    </StyledNetworkButton>
  )
}

export const StyledMobileNetworkButton = styled(Button)(({ theme }) => ({
  backgroundColor: COLORS.white,
  borderRadius: '30px',
  border: `solid 1px ${COLORS.brandExtraDark}`,
  fontSize: '14px',
  fontWeight: 500,
  color: COLORS.brandDark,
  gap: theme.spacing(3),
  height: '30px',
  padding: `0 ${theme.spacing(4)}`,

  '&:hover, &:focus-visible': {
    backgroundColor: COLORS.white,
  },
}))

export const MobileNetworkButton: FC<NetworkButtonProps> = ({ isOutOfDate, layer, network, onClick }) => {
  const { t } = useTranslation()
  const labels = getLayerLabels(t)

  return (
    <StyledMobileNetworkButton onClick={onClick}>
      {labels[layer]}
      <LayerStatus isOutOfDate={isOutOfDate} />
    </StyledMobileNetworkButton>
  )
}
