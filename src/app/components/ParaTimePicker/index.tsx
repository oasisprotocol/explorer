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

type ParaTimePickerProps = {
  onClose: () => void
  onConfirm: (network: Network, layer: Layer) => void
  open: boolean
  isOutOfDate: boolean | undefined
}

export const ParaTimePicker: FC<ParaTimePickerProps> = ({ onClose, onConfirm, open, isOutOfDate }) => (
  <Drawer anchor="top" open={open} onClose={onClose}>
    <ParaTimePickerContent onClose={onClose} onConfirm={onConfirm} isOutOfDate={isOutOfDate} />
  </Drawer>
)

const StyledParaTimePickerContent = styled(Box)(({ theme }) => ({
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

type ParaTimePickerContentProps = Omit<ParaTimePickerProps, 'open'>

enum ParaTimePickerTabletStep {
  Network,
  ParaTime,
  ParaTimeDetails,
}

const ParaTimePickerContent: FC<ParaTimePickerContentProps> = ({ isOutOfDate, onClose, onConfirm }) => {
  const { isMobile, isTablet } = useScreenSize()
  const { t } = useTranslation()
  const { network, layer } = useRequiredScopeParam()
  const [selectedLayer, setSelectedLayer] = useState<Layer>(layer)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(network)
  const [tabletStep, setTabletStep] = useState<ParaTimePickerTabletStep>(
    ParaTimePickerTabletStep.ParaTimeDetails,
  )
  const selectNetwork = (newNetwork: Network) => {
    const enabledLayers = RouteUtils.getEnabledLayersForNetwork(newNetwork)
    const targetLayer = enabledLayers.includes(selectedLayer) ? selectedLayer : enabledLayers[0]
    setSelectedNetwork(newNetwork)
    setSelectedLayer(targetLayer)
  }
  const handleConfirm = () => onConfirm(selectedNetwork, selectedLayer)

  return (
    <StyledParaTimePickerContent>
      <Box sx={{ mb: isTablet ? 0 : 5, color: 'red', position: 'relative' }}>
        <HomePageLink color={COLORS.brandExtraDark} showText={!isMobile} />
      </Box>
      {isTablet && (
        <TabletActionBar>
          <div>
            {tabletStep === ParaTimePickerTabletStep.ParaTime && (
              <TabletBackButton
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={() => {
                  setTabletStep(ParaTimePickerTabletStep.Network)
                }}
              >
                {t('paraTimePicker.viewNetworks')}
              </TabletBackButton>
            )}
            {tabletStep === ParaTimePickerTabletStep.ParaTimeDetails && (
              <TabletBackButton
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={() => {
                  setTabletStep(ParaTimePickerTabletStep.ParaTime)
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
          {(!isTablet || (isTablet && tabletStep === ParaTimePickerTabletStep.Network)) && (
            <Grid xs={12} md={3}>
              <NetworkMenu
                activeNetwork={network}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={network => {
                  selectNetwork(network)
                  setTabletStep(ParaTimePickerTabletStep.ParaTime)
                }}
              />
            </Grid>
          )}
          {(!isTablet || (isTablet && tabletStep === ParaTimePickerTabletStep.ParaTime)) && (
            <Grid xs={12} md={3}>
              <LayerMenu
                activeLayer={layer}
                network={network}
                selectedLayer={selectedLayer}
                selectedNetwork={selectedNetwork}
                setSelectedLayer={layer => {
                  setSelectedLayer(layer)
                  setTabletStep(ParaTimePickerTabletStep.ParaTimeDetails)
                }}
              />
            </Grid>
          )}
          {(!isTablet || (isTablet && tabletStep === ParaTimePickerTabletStep.ParaTimeDetails)) && (
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
    </StyledParaTimePickerContent>
  )
}
