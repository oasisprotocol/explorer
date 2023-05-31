import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Unstable_Grid2'
import { Logotype } from './../PageLayout/Logotype'
import { COLORS } from '../../../styles/theme/colors'
import { Network } from '../../../types/network'
import { Layer } from '../../../oasis-indexer/api'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { NetworkMenuIcon } from './NetworkMenuIcon'
import { NetworkMenu } from './NetworkMenu'
import { LayerMenu } from './LayerMenu'
import { LayerDetails } from './LayerDetails'
import HighlightOff from '@mui/icons-material/HighlightOff'
import { RouteUtils } from '../../utils/route-utils'

type ParaTimePickerProps = {
  onClose: () => void
  onConfirm: (network: Network, layer: Layer) => void
  open: boolean
}

export const ParaTimePicker: FC<ParaTimePickerProps> = ({ onClose, onConfirm, open }) => (
  <Drawer anchor="top" open={open} onClose={onClose}>
    <ParaTimePickerContent onClose={onClose} onConfirm={onConfirm} />
  </Drawer>
)

type ParaTimePickerContentProps = Omit<ParaTimePickerProps, 'open'>

const ParaTimePickerContent: FC<ParaTimePickerContentProps> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation()
  const { network, layer } = useRequiredScopeParam()
  const [showNetworkMenu, setShowNetworkMenu] = useState(network !== Network.mainnet)
  const [selectedLayer, setSelectedLayer] = useState<Layer>(layer)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(network)
  const selectNetwork = (newNetwork: Network) => {
    setSelectedNetwork(newNetwork)
    setSelectedLayer(RouteUtils.getEnabledLayersForNetwork(newNetwork)[0])
  }

  return (
    <Box>
      <Box sx={{ mb: 5, color: 'red', position: 'relative' }}>
        <Logotype color={COLORS.brandExtraDark} />
        <HighlightOff
          htmlColor={COLORS.brandExtraDark}
          onClick={onClose}
          fontSize={'large'}
          sx={{
            position: 'absolute',
            right: 0,
          }}
        />
      </Box>
      <IconButton
        aria-label={t('paraTimePicker.toggleNetworkMenu')}
        onClick={() => setShowNetworkMenu(!showNetworkMenu)}
        sx={{
          color: COLORS.brandDark,
          ml: 3,
        }}
      >
        {showNetworkMenu ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
      </IconButton>
      <Divider />
      <Box>
        <Grid container>
          {!showNetworkMenu && (
            <Grid xs={1} sx={{ maxWidth: '40px' }}>
              <NetworkMenuIcon network={selectedNetwork} />
            </Grid>
          )}
          {showNetworkMenu && (
            <Grid xs={4} md={3}>
              <NetworkMenu
                activeNetwork={network}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={selectNetwork}
              />
            </Grid>
          )}
          <Grid xs={4} md={3}>
            <LayerMenu
              activeLayer={layer}
              network={network}
              selectedLayer={selectedLayer}
              selectedNetwork={selectedNetwork}
              setSelectedLayer={setSelectedLayer}
            />
          </Grid>
          <Grid xs={showNetworkMenu ? 4 : 7} md={6}>
            <LayerDetails activeLayer={layer} selectedLayer={selectedLayer} network={selectedNetwork} />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <Button onClick={onClose} color="secondary" variant="outlined" sx={{ textTransform: 'capitalize' }}>
            {t('common.cancel')}
          </Button>

          <Button
            onClick={() => onConfirm(selectedNetwork!, selectedLayer!)}
            disabled={selectedNetwork === network && selectedLayer === layer}
            color="primary"
            variant="contained"
          >
            {t('common.select')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
