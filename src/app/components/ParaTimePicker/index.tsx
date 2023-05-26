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
  const [showNetworkMenu, setShowNetworkMenu] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<undefined | Layer>()
  const [selectedNetwork, setSelectedNetwork] = useState<undefined | Network>(Network.mainnet)
  const [hoveredLayer, setHoveredLayer] = useState<undefined | Layer>()
  const [hoveredNetwork, setHoveredNetwork] = useState<undefined | Network>()

  return (
    <Box>
      <Box sx={{ mb: 5, color: 'red' }}>
        <Logotype color={COLORS.brandExtraDark} />
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
      <Box
        onMouseLeave={() => {
          setHoveredNetwork(undefined)
        }}
      >
        <Grid container>
          {!showNetworkMenu && (
            <Grid xs={1} sx={{ maxWidth: '40px' }}>
              <NetworkMenuIcon network={selectedNetwork || network} />
            </Grid>
          )}
          {showNetworkMenu && (
            <Grid xs={3}>
              <NetworkMenu
                activeNetwork={network}
                hoveredNetwork={hoveredNetwork}
                selectedNetwork={selectedNetwork}
                setHoveredNetwork={setHoveredNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />
            </Grid>
          )}
          <Grid xs={3}>
            <LayerMenu
              activeLayer={layer}
              hoveredLayer={hoveredLayer}
              selectedLayer={selectedLayer}
              setHoveredLayer={setHoveredLayer}
              setSelectedLayer={setSelectedLayer}
            />
          </Grid>
          <Grid xs={6}>
            <LayerDetails
              activeLayer={layer}
              hoveredLayer={hoveredLayer}
              selectedLayer={selectedLayer}
              network={selectedNetwork || network}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <Button onClick={onClose} color="secondary" variant="outlined" sx={{ textTransform: 'capitalize' }}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => onConfirm(selectedNetwork!, selectedLayer!)}
            disabled={!selectedLayer || !selectedNetwork}
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
