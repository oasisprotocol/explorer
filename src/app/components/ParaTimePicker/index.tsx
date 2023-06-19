import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Unstable_Grid2'
import { Logotype } from '../PageLayout/Logotype'
import { COLORS } from '../../../styles/theme/colors'
import { Network } from '../../../types/network'
import { Layer } from '../../../oasis-indexer/api'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { NetworkMenuIcon } from './NetworkMenuIcon'
import { NetworkMenu } from './NetworkMenu'
import { LayerMenu } from './LayerMenu'
import { LayerDetails } from './LayerDetails'
import { RouteUtils } from '../../utils/route-utils'
import { styled } from '@mui/material/styles'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import { useScreenSize } from '../../hooks/useScreensize'

type ParaTimePickerProps = {
  onClose: () => void
  onConfirm: (network: Network, layer: Layer) => void
  open: boolean
}

const ParaTimePickerDrawer = styled(Drawer)(() => ({
  [`.${drawerClasses.root}`]: {
    height: '100vh',
  },
}))

export const ParaTimePicker: FC<ParaTimePickerProps> = ({ onClose, onConfirm, open }) => (
  <ParaTimePickerDrawer anchor="top" open={open} onClose={onClose}>
    <ParaTimePickerContent onClose={onClose} onConfirm={onConfirm} />
  </ParaTimePickerDrawer>
)

const StyledParaTimePickerContent = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
  },
}))

const StyledContent = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}))

const TabletBackButton = styled(Button)({
  color: COLORS.brandDark,
  width: 'fit-content',
  textTransform: 'capitalize',
  textDecoration: 'none',
})

const TabletActionBar = styled(Box)(() => ({
  minHeight: '50px',
}))

const ActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    gap: theme.spacing(4),
  },
}))

type ParaTimePickerContentProps = Omit<ParaTimePickerProps, 'open'>

enum ParaTimePickerTabletStep {
  Network,
  ParaTime,
  ParaTimeDetails,
}

const ParaTimePickerContent: FC<ParaTimePickerContentProps> = ({ onClose, onConfirm }) => {
  const { isTablet } = useScreenSize()
  const { t } = useTranslation()
  const { network, layer } = useRequiredScopeParam()
  const [showNetworkMenu, setShowNetworkMenu] = useState(isTablet || network !== Network.mainnet)
  const [selectedLayer, setSelectedLayer] = useState<Layer>(layer)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(network)
  const [tabletStep, setTabletStep] = useState<ParaTimePickerTabletStep>(
    ParaTimePickerTabletStep.ParaTimeDetails,
  )
  const selectNetwork = (newNetwork: Network) => {
    setSelectedNetwork(newNetwork)
    setSelectedLayer(RouteUtils.getEnabledLayersForNetwork(newNetwork)[0])
  }

  return (
    <StyledParaTimePickerContent>
      {!isTablet && (
        <>
          <Box sx={{ mb: 5, color: 'red', position: 'relative' }}>
            <Logotype color={COLORS.brandExtraDark} showText={true} />
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
        </>
      )}
      {isTablet && (
        <>
          <TabletActionBar>
            {tabletStep === ParaTimePickerTabletStep.ParaTime && (
              <TabletBackButton
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={() => {
                  setTabletStep(ParaTimePickerTabletStep.Network)
                }}
              >
                {t('paraTimePicker.viewNetworks')}
              </TabletBackButton>
            )}
            {tabletStep === ParaTimePickerTabletStep.ParaTimeDetails && (
              <TabletBackButton
                variant="text"
                startIcon={<KeyboardArrowLeft />}
                onClick={() => {
                  setTabletStep(ParaTimePickerTabletStep.ParaTime)
                }}
              >
                {t('paraTimePicker.viewParaTimes')}
              </TabletBackButton>
            )}
          </TabletActionBar>
        </>
      )}
      <Divider />
      <StyledContent>
        <Grid container>
          {!showNetworkMenu && !isTablet && (
            <Grid xs={1} sx={{ maxWidth: '40px' }}>
              <NetworkMenuIcon network={selectedNetwork} />
            </Grid>
          )}
          {((!isTablet && showNetworkMenu) ||
            (isTablet && tabletStep === ParaTimePickerTabletStep.Network)) && (
            <Grid xs={12} md={3}>
              <NetworkMenu
                activeNetwork={network}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={network => {
                  selectNetwork(network)
                  setTabletStep(ParaTimePickerTabletStep.ParaTime)
                }}
              />
            </Grid>
          )}
          {(!isTablet || (isTablet && tabletStep === ParaTimePickerTabletStep.ParaTime)) && (
            <Grid xs={12} md={3}>
              <LayerMenu
                activeLayer={layer}
                network={network}
                selectedLayer={selectedLayer}
                selectedNetwork={selectedNetwork}
                setSelectedLayer={layer => {
                  setSelectedLayer(layer)
                  setTabletStep(ParaTimePickerTabletStep.ParaTimeDetails)
                }}
              />
            </Grid>
          )}
          {(!isTablet || (isTablet && tabletStep === ParaTimePickerTabletStep.ParaTimeDetails)) && (
            <Grid xs={12} md={showNetworkMenu ? 4 : 7} lg={6}>
              <LayerDetails activeLayer={layer} selectedLayer={selectedLayer} network={selectedNetwork} />
            </Grid>
          )}
        </Grid>

        <ActionBar>
          <Button
            onClick={onClose}
            color="secondary"
            variant="outlined"
            sx={{ textTransform: 'capitalize' }}
            size="large"
          >
            {t('common.cancel')}
          </Button>

          <Button
            onClick={() => onConfirm(selectedNetwork!, selectedLayer!)}
            disabled={selectedNetwork === network && selectedLayer === layer}
            color="primary"
            variant="contained"
            size="large"
          >
            {t('common.select')}
          </Button>
        </ActionBar>
      </StyledContent>
    </StyledParaTimePickerContent>
  )
}
