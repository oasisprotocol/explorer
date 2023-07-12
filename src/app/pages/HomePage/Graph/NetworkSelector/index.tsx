import { FC, ForwardedRef, forwardRef, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../../../styles/theme/colors'
import { getNetworkNames, Network } from '../../../../../types/network'
import { RouteUtils } from '../../../../utils/route-utils'
import {
  Select,
  SelectOptionBase,
  StyledSelectButton,
  StyledSelectListbox,
  StyledSelectOption,
} from '../../../../components/Select'
import { selectClasses, SelectRootSlotProps } from '@mui/base/Select'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getNetworkIcons } from '../../../../utils/content'
import { optionClasses } from '@mui/base/Option'

interface NetworkOption extends SelectOptionBase {
  label: Network
  value: Network
}

const StyledNetworkSelector = styled(Select<NetworkOption>)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    bottom: theme.spacing(5),
  },
}))

const StyledButton = styled(StyledSelectButton)(({ theme }) => ({
  height: '44px',
  minWidth: '200px',
  backgroundColor: theme.palette.layout.primaryBackground,
  border: `2px solid ${theme.palette.layout.lightBorder}`,
  color: theme.palette.layout.main,
  '&:hover': {
    backgroundColor: theme.palette.layout.primaryBackground,
  },
  [`&.${selectClasses.focusVisible}`]: {
    backgroundColor: theme.palette.layout.primaryBackground,
    outline: 'none',
    border: `2px solid ${theme.palette.layout.main}`,
  },
}))

const StyledListbox = styled(StyledSelectListbox)(() => ({
  minWidth: '200px',
  background: COLORS.white,
  color: COLORS.grayDark,
}))

const StyledOption = styled(StyledSelectOption)(() => ({
  height: '44px',
  color: COLORS.grayDark,
  svg: {
    color: COLORS.grayExtraDark,
  },
  [`&:hover:not(.${optionClasses.disabled}),
  &.${optionClasses.highlighted}`]: {
    backgroundColor: COLORS.grayLight,
  },
}))

const SelectOption = ({ value }: NetworkOption): ReactElement => {
  const { t } = useTranslation()

  const labels = getNetworkNames(t)
  const icons = getNetworkIcons()

  return (
    <StyledOption key={value} value={value}>
      <Box
        sx={theme => ({ display: 'flex', gap: theme.spacing(3), pl: theme.spacing(3), alignItems: 'center' })}
      >
        {icons[value]}
        <Typography variant="inherit">{labels[value]}</Typography>
      </Box>
    </StyledOption>
  )
}

const NetworkSelectorButton = forwardRef(
  (props: SelectRootSlotProps<Network, false>, ref: ForwardedRef<HTMLButtonElement>) => {
    const { ownerState, ...restProps } = props
    const { open, value } = ownerState
    const { t } = useTranslation()
    const label = getNetworkNames(t)
    const icons = getNetworkIcons()

    return (
      <StyledButton {...restProps} ref={ref} color="inherit">
        <Box
          sx={theme => ({
            display: 'flex',
            gap: theme.spacing(3),
            pl: theme.spacing(3),
            alignItems: 'center',
          })}
        >
          {icons[value!]}
          <Typography variant="inherit">{label[value!]}</Typography>
        </Box>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </StyledButton>
    )
  },
)

interface NetworkSelectProps {
  network: Network
  setNetwork: (network: Network | null) => void
}

export const NetworkSelector: FC<NetworkSelectProps> = ({ network, setNetwork }) => {
  const { t } = useTranslation()

  const options = RouteUtils.getEnabledNetworks().map(network => ({
    label: network,
    value: network,
  }))

  return (
    <StyledNetworkSelector
      defaultValue={network}
      handleChange={setNetwork}
      options={options}
      placement="top-start"
      root={NetworkSelectorButton}
      Option={SelectOption}
      listbox={StyledListbox}
      label={
        <Typography variant="caption" sx={theme => ({ color: theme.palette.layout.main })}>
          {t('home.selectedNetwork')}
        </Typography>
      }
    />
  )
}
