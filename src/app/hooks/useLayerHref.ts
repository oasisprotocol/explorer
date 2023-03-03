import { Layer } from '../../config'
import { useHref } from 'react-router-dom'
import { useLayer } from './useLayer'

export const useLayerHref = (href = '', layer?: Layer): ReturnType<typeof useHref> => {
  const layerParam = useLayer()

  const getLayerPrefix = () => {
    if (!href.startsWith('/')) {
      return ''
    }

    if (layer) {
      return `/${layer}/`
    }

    if (layerParam) {
      return `/${layerParam}/`
    }

    return ''
  }

  return useHref(`${getLayerPrefix()}${href}`)
}
