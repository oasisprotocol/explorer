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
import { SearchScope } from '../../../types/searchScope'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { NetworkMenu } from './NetworkMenu'
import { LayerMenu } from './LayerMenu'
import { LayerDetails } from './LayerDetails'
import { scopeFreedom, RouteUtils, mergeNetworksInLayerSelector } from '../../utils/route-utils'
import { styled } from '@mui/material/styles'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import { useScreenSize } from '../../hooks/useScreensize'
import { MobileNetworkButton } from '../PageLayout/NetworkButton'

type LayerPickerProps = {
  onClose: () => void
  onConfirm: (scope: SearchScope) => void
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
  Layer,
  LayerDetails,
}

const LayerPickerContent: FC<LayerPickerContentProps> = ({ isOutOfDate, onClose, onConfirm }) => {
  const { isMobile, isTablet } = useScreenSize()
  const { t } = useTranslation()
  const activeScope = useRequiredScopeParam()
  const [selectedScope, setSelectedScope] = useState<SearchScope>(activeScope)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(activeScope.network)
  const [tabletStep, setTabletStep] = useState<LayerPickerTabletStep>(LayerPickerTabletStep.LayerDetails)
  const selectNetwork = (newNetwork: Network) => {
    const enabledLayers = RouteUtils.getAllLayersForNetwork(newNetwork).enabled
    const targetScope = {
      network: newNetwork,
      layer: enabledLayers.includes(selectedScope.layer) ? selectedScope.layer : enabledLayers[0],
    }
    setSelectedNetwork(newNetwork)
    setSelectedScope(targetScope)
  }
  const handleConfirm = () => onConfirm(selectedScope)

  return (
    <StyledLayerPickerContent>
      <Box sx={{ mb: isTablet ? 0 : 5, color: 'red', position: 'relative' }}>
        <HomePageLink color={COLORS.brandExtraDark} showText={!isMobile} />
      </Box>
      {isTablet && (
        <TabletActionBar>
          <div>
            {
              // Do we need a "back to networks" button ?
              ((scopeFreedom === 'network-layer' &&
                !mergeNetworksInLayerSelector &&
                tabletStep === LayerPickerTabletStep.Layer) || // Stepping back from layers
                (scopeFreedom === 'network' && tabletStep === LayerPickerTabletStep.LayerDetails)) && ( // Stepping back from details, skipping layers
                <TabletBackButton
                  variant="text"
                  startIcon={<KeyboardArrowLeft />}
                  onClick={() => {
                    setTabletStep(LayerPickerTabletStep.Network)
                  }}
                >
                  {t('layerPicker.viewNetworks')}
                </TabletBackButton>
              )
            }
            {scopeFreedom !== 'network' &&
              tabletStep === LayerPickerTabletStep.LayerDetails && ( // Stepping back from details, going to layers
                <TabletBackButton
                  variant="text"
                  startIcon={<KeyboardArrowLeft />}
                  onClick={() => {
                    setTabletStep(LayerPickerTabletStep.Layer)
                  }}
                >
                  {t('layerPicker.viewLayers')}
                </TabletBackButton>
              )}
          </div>
          <MobileNetworkButton
            isOutOfDate={isOutOfDate}
            network={activeScope.network}
            layer={activeScope.layer}
            onClick={onClose}
          />
        </TabletActionBar>
      )}
      <Divider />
      <StyledContent>
        <Grid container>
          {!(scopeFreedom === 'layer' || mergeNetworksInLayerSelector) &&
            (!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.Network)) && (
              <Grid xs={12} md={3}>
                <NetworkMenu
                  activeNetwork={activeScope.network}
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={network => {
                    selectNetwork(network)
                    setTabletStep(
                      scopeFreedom === 'network' // Are we fixed to a specific layer, selecting only network?
                        ? LayerPickerTabletStep.LayerDetails // If so, skip layer selection, go straight to layer details.
                        : LayerPickerTabletStep.Layer, // Otherwise, go to layer selection.
                    )
                  }}
                />
              </Grid>
            )}
          {scopeFreedom !== 'network' &&
            (!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.Layer)) && (
              <Grid xs={12} md={3}>
                <LayerMenu
                  selectedNetwork={selectedNetwork}
                  selectedScope={selectedScope}
                  setSelectedScope={scope => {
                    setSelectedScope(scope)
                    setTabletStep(LayerPickerTabletStep.LayerDetails)
                  }}
                />
              </Grid>
            )}
          {(!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.LayerDetails)) && (
            <Grid xs={12} md={6}>
              <LayerDetails
                handleConfirm={handleConfirm}
                selectedScope={selectedScope}
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
            {selectedScope.network === activeScope.network && selectedScope.layer === activeScope.layer
              ? t('layerPicker.goToDashboard')
              : t('common.select')}
          </Button>
        </ActionBar>
      </StyledContent>
    </StyledLayerPickerContent>
  )
}
