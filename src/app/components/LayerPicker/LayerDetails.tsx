import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Button from '@mui/material/Button'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useTheme } from '@mui/material/styles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { styled } from '@mui/material/styles'
import { Circle } from '../Circle'
import { COLORS } from '../../../styles/theme/colors'
import { Network, getNetworkNames } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { Link as RouterLink } from 'react-router-dom'
import { docs } from '../../utils/externalLinks'
import { TextList, TextListItem } from '../TextList'
import { getLayerLabels, getNetworkIcons } from '../../utils/content'
import { ConsensusScope, getNameForScope, RuntimeScope, SearchScope } from '../../../types/searchScope'
import { useConsensusFreshness, useRuntimeFreshness } from '../OfflineBanner/hook'
import { LayerStatus } from '../LayerStatus'
import { mergeNetworksInLayerSelector } from '../../utils/route-utils'

type LayerDetailsContent = {
  description: string
  rpcHttp?: string
  rpcWebSockets?: string
  chainHexId: string
  chainDecimalId: string
  docs?: string
}

type NetworkDetails = Partial<Record<Layer, LayerDetailsContent>>
type Details = Record<Network, NetworkDetails>
const getDetails = (t: TFunction): Details => ({
  mainnet: {
    emerald: {
      description: t('layerPicker.mainnet.emerald'),
      rpcHttp: 'https://emerald.oasis.io',
      rpcWebSockets: 'wss://emerald.oasis.io/ws',
      chainHexId: '0xa516',
      chainDecimalId: '42262',
      docs: docs.emerald,
    },
    sapphire: {
      description: t('layerPicker.mainnet.sapphire'),
      rpcHttp: 'https://sapphire.oasis.io',
      rpcWebSockets: 'wss://sapphire.oasis.io/ws',
      chainHexId: '0x5afe',
      chainDecimalId: '23294',
      docs: docs.sapphire,
    },
  },
  testnet: {
    emerald: {
      description: t('layerPicker.testnet.emerald'),
      rpcHttp: 'https://testnet.emerald.oasis.io',
      rpcWebSockets: 'wss://testnet.emerald.oasis.io/ws',
      chainHexId: '0xa515',
      chainDecimalId: '42261',
      docs: docs.emerald,
    },
    sapphire: {
      description: t('layerPicker.testnet.sapphire'),
      rpcHttp: 'https://testnet.sapphire.oasis.io',
      rpcWebSockets: 'wss://testnet.sapphire.oasis.io/ws',
      chainHexId: '0x5aff',
      chainDecimalId: '23295',
      docs: docs.sapphire,
    },
    pontusxdev: {
      description: t('layerPicker.testnet.pontusxdev'),
      // See https://docs.pontus-x.eu/docs/Pontus-X%20Testnet/quick_start#setup-metamask
      rpcHttp: 'https://rpc.dev.pontus-x.eu',
      chainHexId: '0x7ec8',
      chainDecimalId: '32456',
      docs: docs.pontusx1,
    },
    pontusxtest: {
      description: t('layerPicker.testnet.pontusxtest'),
      // See https://docs.pontus-x.eu/docs/Pontus-X%20Testnet/quick_start#setup-metamask
      rpcHttp: 'https://rpc.test.pontus-x.eu',
      chainHexId: '0x7ec9',
      chainDecimalId: '32457',
      docs: docs.pontusx1,
    },
  },
  localnet: {
    sapphire: {
      chainHexId: '0x5afd',
      chainDecimalId: '23293',
      description: t('layerPicker.localnet.sapphire'),
    },
    emerald: {
      chainHexId: '0xa514',
      chainDecimalId: '42260',
      description: t('layerPicker.localnet.emerald'),
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

type LayerDetailsProps<Scope = SearchScope> = {
  handleConfirm: () => void
  selectedScope: Scope
  isOutOfDate: boolean | undefined
}

// Prevent modal height from changing height when switching between layers
const contentMinHeight = '270px'

export const LayerDetails: FC<LayerDetailsProps> = ({
  selectedScope: { network, layer },
  ...rest
}: LayerDetailsProps) =>
  layer === 'consensus' ? (
    <ConsensusDetails selectedScope={{ network, layer }} {...rest} />
  ) : (
    <RuntimeDetails selectedScope={{ network, layer }} {...rest} />
  )

const ConsensusDetails: FC<LayerDetailsProps<ConsensusScope>> = props => {
  const { t } = useTranslation()
  const { handleConfirm, selectedScope } = props
  const isOutOfDate = useConsensusFreshness(selectedScope.network).outOfDate
  const isLocal = selectedScope.network === 'localnet'

  return (
    <LayerDetailsSection
      docsUrl={isLocal ? undefined : docs.consensus}
      handleConfirm={handleConfirm}
      isOutOfDate={isOutOfDate}
      selectedScope={selectedScope}
    >
      <Typography className="pb-4">{t('layerPicker.consensus')}</Typography>
    </LayerDetailsSection>
  )
}

const RuntimeDetails: FC<LayerDetailsProps<RuntimeScope>> = props => {
  const { t } = useTranslation()
  const { handleConfirm, selectedScope } = props
  const isOutOfDate = useRuntimeFreshness(selectedScope).outOfDate
  const details = getDetails(t)[selectedScope.network]?.[selectedScope.layer]
  const networkNames = getNetworkNames(t)

  return (
    <LayerDetailsSection
      docsUrl={details?.docs}
      handleConfirm={handleConfirm}
      isOutOfDate={isOutOfDate}
      selectedScope={selectedScope}
    >
      {mergeNetworksInLayerSelector && (
        <Typography className="pb-4">
          {t('layerPicker.hostedOn', {
            network: networkNames[selectedScope.network],
          })}
        </Typography>
      )}
      {details?.description && <Typography className="pb-4">{details.description}</Typography>}
      <TextList>
        {details?.rpcHttp && (
          <TextListItem>
            {t('layerPicker.rpcHttp', {
              endpoint: details.rpcHttp,
            })}
          </TextListItem>
        )}
        {details?.rpcWebSockets && (
          <TextListItem>
            {t('layerPicker.rpcWebSockets', {
              endpoint: details.rpcWebSockets,
            })}
          </TextListItem>
        )}
        {details?.chainHexId && details?.chainDecimalId && (
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
        )}
      </TextList>
    </LayerDetailsSection>
  )
}

type LayerDetailsSectionProps = LayerDetailsProps & {
  children: React.ReactNode
  docsUrl?: string
}

export const LayerDetailsSection: FC<LayerDetailsSectionProps> = ({
  children,
  docsUrl,
  handleConfirm,
  isOutOfDate,
  selectedScope,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const networkNames = getNetworkNames(t)
  const layerLabels = getLayerLabels(t)
  const icons = getNetworkIcons()

  return (
    <div className="flex py-4 px-1 md:px-8" style={{ minHeight: contentMinHeight }}>
      <div className="pt-0.5 pr-4 text-primary">
        <Circle
          color={COLORS.white}
          size={5}
          sx={{
            borderColor: COLORS.brandDark,
            borderWidth: theme.spacing(1),
            borderStyle: 'solid',
          }}
        >
          {icons[selectedScope.network]}
        </Circle>
      </div>
      <div>
        <div className="flex items-center pb-2">
          <StyledButton variant="text" onClick={handleConfirm}>
            {getNameForScope(t, selectedScope)}
          </StyledButton>
          <LayerStatus isOutOfDate={isOutOfDate} withTooltip />
        </div>
        {children}
        {docsUrl && (
          <Link asChild>
            <RouterLink
              to={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-normal"
            >
              {t('layerPicker.readMore', {
                layer: layerLabels[selectedScope.layer],
                network: networkNames[selectedScope.network],
              })}
              <OpenInNewIcon sx={{ fontSize: '16px' }} />
            </RouterLink>
          </Link>
        )}
      </div>
    </div>
  )
}
