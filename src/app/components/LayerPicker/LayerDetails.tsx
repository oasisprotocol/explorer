import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { Circle } from '../Circle'
import { COLORS } from '../../../styles/theme/colors'
import { Network, getNetworkNames } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { Link as RouterLink } from 'react-router-dom'
import { docs } from '../../utils/externalLinks'
import { TextList, TextListItem } from '../TextList'
import { getLayerLabels, getNetworkIcons } from '../../utils/content'
import { getNameForScope } from '../../../types/searchScope'
import { useConsensusFreshness, useRuntimeFreshness } from '../OfflineBanner/hook'
import { LayerStatus } from '../LayerStatus'
import { useScreenSize } from '../../hooks/useScreensize'

type LayerDetailsContent = {
  description: string
  rpcHttp: string
  rpcWebSockets?: string
  chainHexId: string
  chainDecimalId: string
  docs: string
}

type NetworkDetails = Partial<Record<Layer, LayerDetailsContent>>
type Details = Record<Network, NetworkDetails>
const getDetails = (t: TFunction): Details => ({
  [Network.mainnet]: {
    [Layer.emerald]: {
      description: t('layerPicker.mainnet.emerald'),
      rpcHttp: 'https://emerald.oasis.dev',
      rpcWebSockets: 'wss://emerald.oasis.dev/ws',
      chainHexId: '0xa516',
      chainDecimalId: '42262',
      docs: docs.emerald,
    },
    [Layer.sapphire]: {
      description: t('layerPicker.mainnet.sapphire'),
      rpcHttp: 'https://sapphire.oasis.io',
      rpcWebSockets: 'wss://sapphire.oasis.io/ws',
      chainHexId: '0x5afe',
      chainDecimalId: '23294',
      docs: docs.sapphire,
    },
  },
  [Network.testnet]: {
    [Layer.emerald]: {
      description: t('layerPicker.testnet.emerald'),
      rpcHttp: 'https://testnet.emerald.oasis.dev',
      rpcWebSockets: 'wss://testnet.emerald.oasis.dev/ws',
      chainHexId: '0xa515',
      chainDecimalId: '42261',
      docs: docs.emerald,
    },
    [Layer.sapphire]: {
      description: t('layerPicker.testnet.sapphire'),
      rpcHttp: 'https://testnet.sapphire.oasis.dev',
      rpcWebSockets: 'wss://testnet.sapphire.oasis.dev/ws',
      chainHexId: '0x5aff',
      chainDecimalId: '23295',
      docs: docs.sapphire,
    },
    [Layer.pontusx]: {
      description: t('layerPicker.testnet.pontusx'),
      rpcHttp: 'https://grpc.sapphire.testnet.oasiscloud.io:443',
      // rpcWebSockets: 'wss://grpc.sapphire.testnet.oasiscloud.io/ws',
      chainHexId: '0x7ec8',
      chainDecimalId: '32456',
      docs: docs.pontusx1,
    },
  },
})

export const StyledButton = styled(Button)(({ theme }) => ({
  height: 30,
  paddingLeft: 0,
  marginRight: theme.spacing(3),
  fontSize: 24,
  color: COLORS.brandDark,
  fontWeight: 700,
  '&&:hover, &&:active, &&:focus-visible': {
    color: COLORS.brandDark,
    textDecoration: 'none',
    borderRadius: 0,
  },
}))

type LayerDetailsProps = {
  handleConfirm: () => void
  network: Network
  selectedLayer: Layer
  isOutOfDate: boolean | undefined
}

// Prevent modal height from changing height when switching between layers
const contentMinHeight = '270px'

export const LayerDetails: FC<LayerDetailsProps> = (props: LayerDetailsProps) =>
  props.selectedLayer === Layer.consensus ? <ConsensusDetails {...props} /> : <RuntimeDetails {...props} />

const ConsensusDetails: FC<LayerDetailsProps> = props => {
  const { t } = useTranslation()
  const { handleConfirm, network, selectedLayer } = props
  const isOutOfDate = useConsensusFreshness(network).outOfDate

  return (
    <LayerDetailsSection
      docsUrl={docs.consensus}
      handleConfirm={handleConfirm}
      isOutOfDate={isOutOfDate}
      selectedLayer={selectedLayer}
      network={network}
    >
      <Typography sx={{ fontSize: '14px', color: COLORS.brandExtraDark, pb: 4 }}>
        {t('layerPicker.consensus')}
      </Typography>
    </LayerDetailsSection>
  )
}

const RuntimeDetails: FC<LayerDetailsProps> = props => {
  const { t } = useTranslation()
  const { handleConfirm, network, selectedLayer } = props
  const isOutOfDate = useRuntimeFreshness({ network, layer: selectedLayer }).outOfDate
  const details = getDetails(t)[network][selectedLayer]
  if (!details) {
    return null
  }

  return (
    <LayerDetailsSection
      docsUrl={details.docs}
      handleConfirm={handleConfirm}
      isOutOfDate={isOutOfDate}
      selectedLayer={selectedLayer}
      network={network}
    >
      <Typography sx={{ fontSize: '14px', color: COLORS.brandExtraDark, pb: 4 }}>
        {details.description}
      </Typography>
      <TextList>
        <TextListItem>
          {t('layerPicker.rpcHttp', {
            endpoint: details.rpcHttp,
          })}
        </TextListItem>
        {details.rpcWebSockets && (
          <TextListItem>
            {t('layerPicker.rpcWebSockets', {
              endpoint: details.rpcWebSockets,
            })}
          </TextListItem>
        )}
        <TextListItem>
          {t('layerPicker.chainId')}
          <TextList>
            <TextListItem>
              {t('layerPicker.hex', {
                id: details.chainHexId,
              })}
            </TextListItem>
            <TextListItem>
              {t('layerPicker.decimal', {
                id: details.chainDecimalId,
              })}
            </TextListItem>
          </TextList>
        </TextListItem>
      </TextList>
    </LayerDetailsSection>
  )
}

type LayerDetailsSectionProps = LayerDetailsProps & {
  children: React.ReactNode
  docsUrl: string
}

export const LayerDetailsSection: FC<LayerDetailsSectionProps> = ({
  children,
  docsUrl,
  handleConfirm,
  isOutOfDate,
  network,
  selectedLayer,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { isMobile, isTablet } = useScreenSize()
  const labels = getNetworkNames(t)
  const layerLabels = getLayerLabels(t)
  const icons = getNetworkIcons()

  return (
    <Box sx={{ px: isTablet ? 2 : 5, py: 4, display: 'flex', minHeight: contentMinHeight }}>
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
            pb: 3,
          }}
        >
          <StyledButton variant="text" onClick={handleConfirm}>
            {getNameForScope(t, { network, layer: selectedLayer })}
          </StyledButton>
          <LayerStatus isOutOfDate={isOutOfDate} withLabel={!isMobile && selectedLayer !== Layer.consensus} />
        </Box>
        {children}
        <Link
          component={RouterLink}
          to={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontSize: '14px',
            fontWeight: 400,
          }}
        >
          {t('layerPicker.readMore', {
            layer: layerLabels[selectedLayer],
            network: labels[network],
          })}
          <OpenInNewIcon sx={{ fontSize: '16px' }} />
        </Link>
      </Box>
    </Box>
  )
}
