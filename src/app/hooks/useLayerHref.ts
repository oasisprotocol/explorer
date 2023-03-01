import { Layer } from '../../config'
import { useHref, useParams } from 'react-router-dom'

export const useLayerHref = (href = '', layer?: Layer): ReturnType<typeof useHref> => {
  const { layer: layerParam } = useParams()

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
