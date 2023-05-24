import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../../../styles/theme/colors'
import { getNetworkNames, Network } from '../../../../../types/network'
import Collapse from '@mui/material/Collapse'
import { RouteUtils } from '../../../../utils/route-utils'

const StyledNetworkSelector = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}))

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.layout.primaryBackground,
  border: `solid 3px ${theme.palette.layout.lightBorder}`,
  borderRadius: '45px',
  padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
  display: 'inline-flex',
  alignItems: 'center',
}))

export const SelectNetworkButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isSelectedNetwork',
})<{ isSelectedNetwork: boolean }>(({ isSelectedNetwork, theme }) => ({
  height: '30px',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  textTransform: 'capitalize',
  fontSize: '16px',
  borderRadius: '9px',
  backgroundColor: isSelectedNetwork
    ? theme.palette.layout.primaryBackground
    : theme.palette.layout.secondary,
  borderColor: isSelectedNetwork ? theme.palette.layout.hoverBorder : theme.palette.layout.secondary,
  borderWidth: theme.spacing(1),
  color: theme.palette.layout.main,
  '&:hover, &:focus-visible': {
    backgroundColor: theme.palette.layout.secondary,
    borderWidth: theme.spacing(1),
    borderColor: COLORS.white,
  },
}))
SelectNetworkButton.defaultProps = {
  size: 'small',
  variant: 'outlined',
  sx: { ml: 4 },
}

type NetworkSelectorProps = {
  network: Network
  setNetwork: (network: Network) => void
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ network, setNetwork }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(false)
  const options: Network[] = RouteUtils.getEnabledNetworks()
  const labels = getNetworkNames(t)

  return (
    <StyledNetworkSelector>
      <StyledBox>
        {!isMobile && (
          <Typography component="span" sx={{ fontSize: '12px', color: theme.palette.layout.main }}>
            {t('home.selectNetwork')}
          </Typography>
        )}
        <Box sx={{ height: 30, display: 'flex' }}>
          {options.map(option => (
            <Collapse orientation="horizontal" in={open || network === option} key={option}>
              <SelectNetworkButton onClick={() => setNetwork(option)} isSelectedNetwork={option === network}>
                {labels[option]}
              </SelectNetworkButton>
            </Collapse>
          ))}
        </Box>
        <IconButton aria-label={t('home.selectNetworkAria')} onClick={() => setOpen(!open)}>
          {open ? (
            <RemoveIcon fontSize="medium" sx={{ color: theme.palette.layout.main, fontSize: '18px' }} />
          ) : (
            <AddIcon fontSize="medium" sx={{ color: theme.palette.layout.main, fontSize: '18px' }} />
          )}
        </IconButton>
      </StyledBox>
    </StyledNetworkSelector>
  )
}
