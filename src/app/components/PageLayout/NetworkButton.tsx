import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button, { buttonClasses } from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { Circle } from '../Circle'
import { MainnetIcon } from '../../components/CustomIcons/Mainnet'
import { TestnetIcon } from '../../components/CustomIcons/Testnet'
import { getLayerNames, Network } from '../../../types/network'
import { Layer } from '../../../oasis-indexer/api'

const getIcons = (): Record<Network, ReactNode> => ({
  [Network.mainnet]: <MainnetIcon />,
  [Network.testnet]: <TestnetIcon />,
})

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
  textTransform: 'capitalize',
  textAlign: 'left',
  overflow: 'hidden',

  [`& .${buttonClasses.startIcon}`]: {
    transitionProperty: 'background-color, color',
    transitionDuration: `${theme.transitions.duration.standard}ms`,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    height: '47px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${theme.spacing(4)}`,
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
    borderRightWidth: theme.spacing(1),
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.layout.secondary,
    backgroundColor: COLORS.white,
  },

  [`& .${buttonClasses.endIcon}`]: {
    padding: `0 ${theme.spacing(4)}`,
  },

  '&:hover, &:focus-visible': {
    borderWidth: theme.spacing(1),
    color: COLORS.white,
    borderColor: theme.palette.layout.hoverBorder,

    [`& .${buttonClasses.startIcon}`]: {
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
  paddingLeft: theme.spacing(3),
}))

type NetworkButtonProps = {
  layer: Layer
  network: Network
}

export const NetworkButton: FC<NetworkButtonProps> = ({ layer, network }) => {
  const { t } = useTranslation()
  const labels = getLayerNames(t)
  const icons = getIcons()

  return (
    <StyledNetworkButton
      sx={{ ml: 4 }}
      size="small"
      variant="outlined"
      startIcon={icons[network]}
      endIcon={<EditIcon />}
    >
      <StyledBox>
        {labels[layer]}
        <Circle color={COLORS.eucalyptus} size={4}>
          <CheckIcon sx={{ fontSize: 16, color: COLORS.white }} />
        </Circle>
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
  textTransform: 'capitalize',
  color: COLORS.brandDark,
  gap: theme.spacing(3),
  height: '30px',
  padding: `0 ${theme.spacing(4)}`,

  '&:hover, &:focus-visible': {
    backgroundColor: COLORS.white,
  },
}))

export const MobileNetworkButton: FC<NetworkButtonProps> = ({ layer }) => {
  const { t } = useTranslation()
  const labels = getLayerNames(t)

  return (
    <StyledMobileNetworkButton>
      {labels[layer]}
      <Circle color={COLORS.eucalyptus} size={4}>
        <CheckIcon sx={{ fontSize: 15, color: COLORS.white }} />
      </Circle>
    </StyledMobileNetworkButton>
  )
}
