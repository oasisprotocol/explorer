import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled } from '@mui/material/styles'
import { NetworkButton, MobileNetworkButton } from './NetworkButton'
import { COLORS } from '../../../styles/theme/colors'
import { Network, getNetworkNames } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { LayerPicker } from './../LayerPicker'
import { RouteUtils } from '../../utils/route-utils'
import { useConsensusFreshness, useRuntimeFreshness } from '../OfflineBanner/hook'

export const StyledBox = styled(Box)(({ theme }) => ({
  marginLeft: `-${theme.spacing(1)}`,
  zIndex: 1,
  display: 'flex',
  borderColor: COLORS.brandExtraDark,
  borderStyle: 'solid',
  borderWidth: '1px 1px 1px 0',
  padding: theme.spacing(2, 3, 2, 2),
  borderTopRightRadius: '9px',
  borderBottomRightRadius: '9px',
  boxShadow: `inset 0px 4px 4px rgba(34, 47, 63, 0.24)`,
}))

type NetworkSelectorProps = {
  layer: Layer
  network: Network
}

export const NetworkSelector: FC<NetworkSelectorProps> = props => {
  return props.layer === Layer.consensus ? (
    <ConsensusNetworkSelector {...props} />
  ) : (
    <RuntimeNetworkSelector {...props} />
  )
}

const ConsensusNetworkSelector: FC<NetworkSelectorProps> = ({ layer, network }) => {
  const { outOfDate } = useConsensusFreshness(network)

  return <NetworkSelectorView layer={layer} network={network} isOutOfDate={outOfDate} />
}

const RuntimeNetworkSelector: FC<NetworkSelectorProps> = ({ layer, network }) => {
  const { outOfDate } = useRuntimeFreshness({ network, layer })

  return <NetworkSelectorView layer={layer} network={network} isOutOfDate={outOfDate} />
}

type NetworkSelectorViewProps = NetworkSelectorProps & {
  isOutOfDate: boolean | undefined
}

const NetworkSelectorView: FC<NetworkSelectorViewProps> = ({ isOutOfDate, layer, network }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isMobile, isTablet } = useScreenSize()
  const labels = getNetworkNames(t)
  const [openDrawer, setOpenDrawer] = useState(false)
  const handleDrawerClose = () => setOpenDrawer(false)
  const handleDrawerOpen = () => setOpenDrawer(true)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isTablet ? 'flex-end' : 'center',
      }}
    >
      <LayerPicker
        open={openDrawer}
        onClose={handleDrawerClose}
        onConfirm={(network: Network, layer: Layer) => {
          handleDrawerClose()
          navigate(RouteUtils.getDashboardRoute({ network, layer }))
        }}
        isOutOfDate={isOutOfDate}
      />
      {!isMobile && (
        <NetworkButton isOutOfDate={isOutOfDate} layer={layer} network={network} onClick={handleDrawerOpen} />
      )}
      {!isTablet && network !== Network.mainnet && (
        <StyledBox>
          <Typography
            component="span"
            sx={{ fontSize: '12px', color: COLORS.brandExtraDark, whiteSpace: 'nowrap' }}
          >
            {t('pageHeader.ribbon', {
              network: labels[network],
            })}
          </Typography>
        </StyledBox>
      )}
      {isMobile && (
        <MobileNetworkButton
          isOutOfDate={isOutOfDate}
          network={network}
          layer={layer}
          onClick={handleDrawerOpen}
        />
      )}
    </Box>
  )
}
