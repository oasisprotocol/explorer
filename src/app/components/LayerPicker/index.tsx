import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import { HomePageLink } from '../PageLayout/Logotype'
import { COLORS } from '../../../styles/theme/colors'
import { Network } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { NetworkMenu } from './NetworkMenu'
import { LayerMenu } from './LayerMenu'
import { LayerDetails } from './LayerDetails'
import { RouteUtils } from '../../utils/route-utils'
import { styled } from '@mui/material/styles'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import { useScreenSize } from '../../hooks/useScreensize'
import { MobileNetworkButton } from '../PageLayout/NetworkButton'

type LayerPickerProps = {
  onClose: () => void
  onConfirm: (network: Network, layer: Layer) => void
  open: boolean
  isOutOfDate: boolean | undefined
}

export const LayerPicker: FC<LayerPickerProps> = ({ onClose, onConfirm, open, isOutOfDate }) => (
  <Drawer anchor="top" open={open} onClose={onClose}>
    <LayerPickerContent onClose={onClose} onConfirm={onConfirm} isOutOfDate={isOutOfDate} />
  </Drawer>
)

const StyledLayerPickerContent = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
  },
}))

const StyledContent = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}))

const TabletBackButton = styled(Button)({
  color: COLORS.brandDark,
  width: 'fit-content',
  textDecoration: 'none',
})

const TabletActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: '55px',
  paddingBottom: theme.spacing(3),
}))

const ActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    gap: theme.spacing(4),
  },
}))

type LayerPickerContentProps = Omit<LayerPickerProps, 'open'>

enum LayerPickerTabletStep {
  Network,
  ParaTime,
  ParaTimeDetails,
}

const LayerPickerContent: FC<LayerPickerContentProps> = ({ isOutOfDate, onClose, onConfirm }) => {
  const { isMobile, isTablet } = useScreenSize()
  const { t } = useTranslation()
  const { network, layer } = useRequiredScopeParam()
  const [selectedLayer, setSelectedLayer] = useState<Layer>(layer)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(network)
  const [tabletStep, setTabletStep] = useState<LayerPickerTabletStep>(LayerPickerTabletStep.ParaTimeDetails)
  const selectNetwork = (newNetwork: Network) => {
    const enabledLayers = RouteUtils.getEnabledLayersForNetwork(newNetwork)
    const targetLayer = enabledLayers.includes(selectedLayer) ? selectedLayer : enabledLayers[0]
    setSelectedNetwork(newNetwork)
    setSelectedLayer(targetLayer)
  }
  const handleConfirm = () => onConfirm(selectedNetwork, selectedLayer)

  return (
    <StyledLayerPickerContent>
      <Box sx={{ mb: isTablet ? 0 : 5, color: 'red', position: 'relative' }}>
        <HomePageLink color={COLORS.brandExtraDark} showText={!isMobile} />
      </Box>
      {isTablet && (
        <TabletActionBar>
          <div>
            {tabletStep === LayerPickerTabletStep.ParaTime && (
              <TabletBackButton
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={() => {
                  setTabletStep(LayerPickerTabletStep.Network)
                }}
              >
                {t('paraTimePicker.viewNetworks')}
              </TabletBackButton>
            )}
            {tabletStep === LayerPickerTabletStep.ParaTimeDetails && (
              <TabletBackButton
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={() => {
                  setTabletStep(LayerPickerTabletStep.ParaTime)
                }}
              >
                {t('paraTimePicker.viewLayers')}
              </TabletBackButton>
            )}
          </div>
          <MobileNetworkButton
            isOutOfDate={isOutOfDate}
            network={network}
            layer={layer}
            onClick={handleConfirm}
          />
        </TabletActionBar>
      )}
      <Divider />
      <StyledContent>
        <Grid container>
          {(!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.Network)) && (
            <Grid xs={12} md={3}>
              <NetworkMenu
                activeNetwork={network}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={network => {
                  selectNetwork(network)
                  setTabletStep(LayerPickerTabletStep.ParaTime)
                }}
              />
            </Grid>
          )}
          {(!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.ParaTime)) && (
            <Grid xs={12} md={3}>
              <LayerMenu
                activeLayer={layer}
                network={network}
                selectedLayer={selectedLayer}
                selectedNetwork={selectedNetwork}
                setSelectedLayer={layer => {
                  setSelectedLayer(layer)
                  setTabletStep(LayerPickerTabletStep.ParaTimeDetails)
                }}
              />
            </Grid>
          )}
          {(!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.ParaTimeDetails)) && (
            <Grid xs={12} md={6}>
              <LayerDetails
                handleConfirm={handleConfirm}
                selectedLayer={selectedLayer}
                network={selectedNetwork}
                isOutOfDate={isOutOfDate}
              />
            </Grid>
          )}
        </Grid>

        <ActionBar>
          <Button onClick={onClose} color="secondary" variant="outlined" size="large">
            {t('common.cancel')}
          </Button>

          <Button onClick={handleConfirm} color="primary" variant="contained" size="large">
            {selectedNetwork === network && selectedLayer === layer
              ? t('paraTimePicker.goToDashboard')
              : t('common.select')}
          </Button>
        </ActionBar>
      </StyledContent>
    </StyledLayerPickerContent>
  )
}
