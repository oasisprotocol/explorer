import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@oasisprotocol/ui-library/src/components/ui/drawer'
import { Separator } from '@oasisprotocol/ui-library/src/components/ui/separator'
import { HomePageLink } from '../PageLayout/Logotype'
import { Network } from '../../../types/network'
import { SearchScope } from '../../../types/searchScope'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { NetworkMenu } from './NetworkMenu'
import { LayerMenu } from './LayerMenu'
import { LayerDetails } from './LayerDetails'
import { scopeFreedom, RouteUtils, mergeNetworksInLayerSelector } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { MobileNetworkButton } from '../PageLayout/NetworkButton'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { ChevronLeft } from 'lucide-react'

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
      <DrawerContent className="py-4 px-[5%] z-[1200] max-lg:h-dvh max-lg:!max-h-dvh max-lg:mb-0">
        <LayerPickerContent onClose={onClose} onConfirm={onConfirm} isOutOfDate={isOutOfDate} />
      </DrawerContent>
    </Drawer>
  </>
)

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
    <div className="flex flex-col w-full flex-1 lg:block lg:w-auto lg:flex-none">
      <div className="relative mb-0 lg:mb-2 lg:mb-10">
        <DrawerTitle>
          <HomePageLink showText={!isMobile} />
        </DrawerTitle>
        <DrawerDescription className="sr-only">{t('layerPicker.description')}</DrawerDescription>
      </div>
      {isTablet && (
        <div className="flex justify-between items-center min-h-12">
          <div>
            {
              // Do we need a "back to networks" button ?
              ((scopeFreedom === 'network-layer' &&
                !mergeNetworksInLayerSelector &&
                tabletStep === LayerPickerTabletStep.Layer) || // Stepping back from layers
                (scopeFreedom === 'network' && tabletStep === LayerPickerTabletStep.LayerDetails)) && ( // Stepping back from details, skipping layers
                <Button
                  variant="ghost"
                  size="default"
                  className="text-primary !pl-0"
                  onClick={() => {
                    setTabletStep(LayerPickerTabletStep.Network)
                  }}
                >
                  <ChevronLeft />
                  {t('layerPicker.viewNetworks')}
                </Button>
              )
            }
            {scopeFreedom !== 'network' &&
              tabletStep === LayerPickerTabletStep.LayerDetails && ( // Stepping back from details, going to layers
                <Button
                  variant="ghost"
                  size="default"
                  className="text-primary !pl-0"
                  onClick={() => setTabletStep(LayerPickerTabletStep.Layer)}
                >
                  <ChevronLeft />
                  {t('layerPicker.viewLayers')}
                </Button>
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
      <div className="flex-1 flex flex-col justify-between lg:block">
        <div className="grid grid-cols-12">
          {!(scopeFreedom === 'layer' || mergeNetworksInLayerSelector) &&
            (!isTablet || (isTablet && tabletStep === LayerPickerTabletStep.Network)) && (
              <div className="col-span-12 lg:col-span-3">
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
              <div className="col-span-12 lg:col-span-3">
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
            <div className="col-span-12 lg:col-span-6">
              <LayerDetails
                handleConfirm={handleConfirm}
                selectedScope={selectedScope}
                isOutOfDate={isOutOfDate}
              />
            </div>
          )}
        </div>

        <div className="flex justify-around lg:justify-end lg:gap-8">
          <Button onClick={onClose} color="secondary" variant="outline" size="lg">
            {t('common.cancel')}
          </Button>

          <Button onClick={handleConfirm} color="primary" variant="default" size="lg">
            {selectedScope.network === activeScope.network && selectedScope.layer === activeScope.layer
              ? t('layerPicker.goToDashboard')
              : t('common.select')}
          </Button>
        </div>
      </div>
    </div>
  )
}
