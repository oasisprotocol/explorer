import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import { Drawer, DrawerContent, DrawerTitle } from '@oasisprotocol/ui-library/src'
import { Separator } from '@oasisprotocol/ui-library/src/components/ui/separator'
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
  <>
    <Drawer direction="top" open={open} onClose={onClose}>
      {/* Match MUI md breakpoint during migration */}
      <DrawerContent className="py-4 px-[5%] z-[1200] max-[900px]:h-dvh max-[900px]:!max-h-dvh max-[900px]:mb-0">
        <LayerPickerContent onClose={onClose} onConfirm={onConfirm} isOutOfDate={isOutOfDate} />
      </DrawerContent>
    </Drawer>
  </>
)

const TabletBackButton = styled(Button)({
  color: COLORS.brandDark,
  width: 'fit-content',
  textDecoration: 'none',
})

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
    <div className="flex flex-col w-full flex-1 md:block md:w-auto md:flex-none">
      <div className="relative mb-0 md:mb-10">
        <HomePageLink color="#0500e2" showText={!isMobile} />
      </div>
      {isTablet && (
        <div className="flex justify-between items-center min-h-14 pb-6">
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
        </div>
      )}
      <Separator />
      <div className="flex-1 flex flex-col justify-between md:block">
        <div className="grid grid-cols-12">
          {!(scopeFreedom === 'layer' || mergeNetworksInLayerSelector) &&
            (!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.Network)) && (
              <div className="col-span-12 md:col-span-3">
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
              </div>
            )}
          {scopeFreedom !== 'network' &&
            (!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.Layer)) && (
              <div className="col-span-12 md:col-span-3">
                <LayerMenu
                  selectedNetwork={selectedNetwork}
                  selectedScope={selectedScope}
                  setSelectedScope={scope => {
                    setSelectedScope(scope)
                    setTabletStep(LayerPickerTabletStep.LayerDetails)
                  }}
                />
              </div>
            )}
          {(!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.LayerDetails)) && (
            <div className="col-span-12 md:col-span-6">
              <LayerDetails
                handleConfirm={handleConfirm}
                selectedScope={selectedScope}
                isOutOfDate={isOutOfDate}
              />
            </div>
          )}
        </div>

        <div className="flex justify-around md:justify-end md:gap-8">
          <Button onClick={onClose} color="secondary" variant="outlined" size="large">
            {t('common.cancel')}
          </Button>

          <Button onClick={handleConfirm} color="primary" variant="contained" size="large">
            {selectedScope.network === activeScope.network && selectedScope.layer === activeScope.layer
              ? t('layerPicker.goToDashboard')
              : t('common.select')}
          </Button>
        </div>
      </div>
    </div>
  )
}
