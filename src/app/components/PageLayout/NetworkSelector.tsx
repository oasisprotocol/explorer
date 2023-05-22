import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'
import { NetworkButton, MobileNetworkButton } from './NetworkButton'
import { COLORS } from '../../../styles/theme/colors'
import { Network, getNetworkNames } from '../../../types/network'
import { Layer } from '../../../oasis-indexer/api'

export const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderColor: COLORS.brandExtraDark,
  borderStyle: 'solid',
  borderWidth: '1px 1px 1px 0',
  padding: `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(2)} ${theme.spacing(2)}`,
  borderTopRightRadius: '9px',
  borderBottomRightRadius: '9px',
  boxShadow: `inset 0px 4px 4px rgba(34, 47, 63, 0.24)`,
}))

type NetworkSelectorProps = {
  layer: Layer
  network: Network
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ layer, network }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const labels = getNetworkNames(t)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isDesktop ? 'center' : 'flex-end',
      }}
    >
      {!isMobile && <NetworkButton layer={layer} network={network} />}
      {isDesktop && (
        <StyledBox>
          <Typography
            component="span"
            sx={{ fontSize: '12px', color: COLORS.brandExtraDark, whiteSpace: 'nowrap' }}
          >
            {t('pageHeader.ribbon', {
              network: labels[network],
            })}
          </Typography>
        </StyledBox>
      )}
      {isMobile && <MobileNetworkButton layer={layer} network={network} />}
    </Box>
  )
}
