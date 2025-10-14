import { uniq } from '../app/utils/helpers'

// Here we need to import from the generated code, in order to break
// a cycle of imports which confuse jest
// eslint-disable-next-line no-restricted-imports
import { Layer } from '../oasis-nexus/generated/api'

export interface HasLayer {
  layer: Layer
}

export const getFilterForLayer = (layer: Layer) => (item: HasLayer) => item.layer === layer

const layerOrder: Record<Layer, number> = {
  consensus: 1,
  sapphire: 2,
  emerald: 3,
  cipher: 4,
  pontusxdev: 6,
  pontusxtest: 5,
}

export function orderByLayer(itemA: Layer, itemB: Layer): number
export function orderByLayer(itemA: HasLayer, itemB: HasLayer): number
export function orderByLayer(itemA: Layer | HasLayer, itemB: Layer | HasLayer): number {
  const layerA = typeof itemA === 'string' ? itemA : itemA.layer
  const layerB = typeof itemB === 'string' ? itemB : itemB.layer
  return layerOrder[layerA] - layerOrder[layerB]
}

const layersWithEncryptedTransactions: Layer[] = ['sapphire', 'cipher']

export const doesLayerSupportEncryptedTransactions = (layer: Layer): boolean =>
  layersWithEncryptedTransactions.includes(layer)

export const doesAnyOfTheseLayersSupportEncryptedTransactions = (layers: Layer[] | undefined): boolean =>
  uniq(layers).some(doesLayerSupportEncryptedTransactions)
