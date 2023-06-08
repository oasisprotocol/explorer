import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CheckIcon from '@mui/icons-material/Check'
import Link from '@mui/material/Link'
import { Circle } from '../Circle'
import { COLORS } from '../../../styles/theme/colors'
import { Network, getNetworkNames } from '../../../types/network'
import { Layer } from '../../../oasis-indexer/api'
import { Link as RouterLink } from 'react-router-dom'
import { docs } from '../../utils/externalLinks'
import { TextList, TextListItem } from '../TextList'
import { getLayerLabels, getNetworkIcons } from '../../utils/content'
import { getNameForScope } from '../../../types/searchScope'

type LayerDetailsContent = {
  description: string
  rpcHttp: string
  rpcWebSockets: string
  chainHexId: string
  chainDecimalId: string
  docs: string
}

type NetworkDetails = Partial<Record<Layer, LayerDetailsContent>>
type Details = Record<Network, NetworkDetails>
const getDetails = (t: TFunction): Details => ({
  [Network.mainnet]: {
    [Layer.emerald]: {
      description: t('paraTimePicker.mainnet.emerald'),
      rpcHttp: 'https://emerald.oasis.dev',
      rpcWebSockets: 'wss://emerald.oasis.dev/ws',
      chainHexId: '0xa516',
      chainDecimalId: '42262',
      docs: docs.emerald,
    },
    [Layer.sapphire]: {
      description: t('paraTimePicker.mainnet.sapphire'),
      rpcHttp: 'https://sapphire.oasis.io',
      rpcWebSockets: 'wss://sapphire.oasis.io/ws',
      chainHexId: '0x5afe',
      chainDecimalId: '23294',
      docs: docs.sapphire,
    },
  },
  [Network.testnet]: {
    [Layer.emerald]: {
      description: t('paraTimePicker.testnet.emerald'),
      rpcHttp: 'https://testnet.emerald.oasis.dev',
      rpcWebSockets: 'wss://testnet.emerald.oasis.dev/ws',
      chainHexId: '0xa515',
      chainDecimalId: '42261',
      docs: docs.emerald,
    },
    [Layer.sapphire]: {
      description: t('paraTimePicker.testnet.sapphire'),
      rpcHttp: 'https://testnet.sapphire.oasis.dev',
      rpcWebSockets: 'wss://testnet.sapphire.oasis.dev/ws',
      chainHexId: '0x5aff',
      chainDecimalId: '23295',
      docs: docs.sapphire,
    },
  },
})

type LayerDetailsProps = {
  activeLayer: Layer
  hoveredLayer?: Layer
  network: Network
  selectedLayer?: Layer
}

// Prevent modal height from changing height when switching between layers
const contentMinHeight = '270px'

export const LayerDetails: FC<LayerDetailsProps> = ({ hoveredLayer, network, selectedLayer }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const labels = getNetworkNames(t)
  const layerLabels = getLayerLabels(t)
  const icons = getNetworkIcons()
  const layer = selectedLayer || hoveredLayer

  if (!layer) {
    // TODO: properly design this placeholder
    return (
      <Box
        sx={{
          padding: '1em',
          width: '100%',
          minHeight: '18em',
          justifyItems: 'center',
          justifyContent: 'center',
          textJustify: 'center',
          // border: '1px solid red',
        }}
      >
        <span>Please select a Paratime on the left!</span>
      </Box>
    )
  }
  const details = getDetails(t)[network][layer]

  if (!details) {
    return null
  }

  return (
    <Box sx={{ px: 5, py: 4, display: 'flex', minHeight: contentMinHeight }}>
      <Box sx={{ pt: 1, pr: 4, color: COLORS.brandDark }}>
        <Circle
          color={COLORS.white}
          size={5}
          sx={{
            borderColor: COLORS.brandDark,
            borderWidth: theme.spacing(1),
            borderStyle: 'solid',
          }}
        >
          {icons[network]}
        </Circle>
      </Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            pb: 2,
          }}
        >
          <Typography sx={{ fontSize: 24, color: COLORS.brandDark, fontWeight: 700, mr: 3 }} component="span">
            {getNameForScope(t, { network, layer })}
          </Typography>
          <Typography sx={{ fontSize: 10, color: COLORS.paraTimeStatus, mr: 3 }} component="span">
            {t('common.paraTimeOnline')}
          </Typography>
          <Circle color={COLORS.eucalyptus} size={4}>
            <CheckIcon sx={{ fontSize: 12, color: COLORS.white }} />
          </Circle>
        </Box>
        <Typography sx={{ fontSize: '12px', color: COLORS.brandExtraDark, pb: 2 }}>
          {details.description}
        </Typography>

        <TextList>
          <TextListItem>
            {t('paraTimePicker.rpcHttp', {
              endpoint: details.rpcHttp,
            })}
          </TextListItem>
          <TextListItem>
            {t('paraTimePicker.rpcWebSockets', {
              endpoint: details.rpcWebSockets,
            })}
          </TextListItem>
          <TextListItem>
            {t('paraTimePicker.chainId')}
            <TextList>
              <TextListItem>
                {t('paraTimePicker.hex', {
                  id: details.chainHexId,
                })}
              </TextListItem>
              <TextListItem>
                {t('paraTimePicker.decimal', {
                  id: details.chainDecimalId,
                })}
              </TextListItem>
            </TextList>
          </TextListItem>
        </TextList>
        <Link
          component={RouterLink}
          to={details.docs}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontSize: '12px',
            fontWeight: 400,
          }}
        >
          {t('paraTimePicker.readMore', {
            layer: layerLabels[layer],
            network: labels[network],
          })}
          <OpenInNewIcon sx={{ fontSize: '16px' }} />
        </Link>
      </Box>
    </Box>
  )
}
