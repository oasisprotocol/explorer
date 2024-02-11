import { uniq } from '../app/utils/helpers'

// Here we need to import from the generated code, in order to break
// a cycle of imports which confuse jest
// eslint-disable-next-line no-restricted-imports
import { Layer } from '../oasis-nexus/generated/api'
import { TFunction } from 'i18next'

export const getLayerNames = (t: TFunction): Record<Layer, string> => ({
  [Layer.emerald]: t('common.emerald'),
  [Layer.sapphire]: t('common.sapphire'),
  [Layer.cipher]: t('common.cipher'),
  [Layer.consensus]: t('common.consensus'),
})

interface HasLayer {
  layer: Layer
}

export const getFilterForLayer = (layer: Layer) => (item: HasLayer) => item.layer === layer

const layerOrder: Record<Layer, number> = {
  [Layer.consensus]: 1,
  [Layer.sapphire]: 2,
  [Layer.emerald]: 3,
  [Layer.cipher]: 4,
}

const hiddenLayers: Layer[] = []

export const orderByLayer = (itemA: HasLayer, itemB: HasLayer): number =>
  layerOrder[itemA.layer] - layerOrder[itemB.layer]

const layersWithEncryptedTransactions: Layer[] = [Layer.sapphire, Layer.cipher]

export const doesLayerSupportEncryptedTransactions = (layer: Layer): boolean =>
  layersWithEncryptedTransactions.includes(layer)

export const doesAnyOfTheseLayersSupportEncryptedTransactions = (layers: Layer[] | undefined): boolean =>
  uniq(layers).some(doesLayerSupportEncryptedTransactions)

export const isLayerHidden = (layer: Layer): boolean => hiddenLayers.includes(layer)
