import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
import oasisLogo from './images/oasis.svg'
import ethLogo from './images/eth.svg'
import { COLORS } from '../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ChangeEvent, FC } from 'react'

const StyledAddressSwitch = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}))

const StyledSwitch = styled(Switch)(() => ({
  width: 110,
  height: 44,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    margin: 2,
    padding: 0,
    transform: 'translateX(1px)',
    '&.Mui-checked': {
      transform: 'translateX(66px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: COLORS.lightSilver,
        '&:before': {
          backgroundImage: `url("${ethLogo}")`,
        },
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: COLORS.grayMedium2,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: COLORS.brandMedium,
    width: 40,
    height: 40,
    '&:before': {
      content: "' '",
      position: 'absolute',
      width: '80%',
      height: '80%',
      left: '10%',
      top: '10%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("${oasisLogo}")`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: COLORS.grayMedium2,
    borderRadius: '50px',
  },
}))

export enum AddressSwitchOption {
  Oasis = 'oasis',
  Eth = 'eth',
}

interface AddressSwitchProps {
  selected?: AddressSwitchOption
  onSelectionChange: (selection: AddressSwitchOption) => void
}

export const AddressSwitch: FC<AddressSwitchProps> = ({
  selected = AddressSwitchOption.Oasis,
  onSelectionChange,
}) => {
  const checked = selected === AddressSwitchOption.Eth

  const onChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onSelectionChange(checked ? AddressSwitchOption.Eth : AddressSwitchOption.Oasis)
  }

  return (
    <StyledAddressSwitch>
      <Typography
        sx={{
          color: selected === AddressSwitchOption.Oasis ? COLORS.brandExtraDark : COLORS.grayMedium2,
        }}
        variant="body2"
      >
        Oasis
      </Typography>
      <StyledSwitch checked={checked} onChange={onChange} />
      <Typography
        sx={{
          color: selected === AddressSwitchOption.Eth ? COLORS.brandExtraDark : COLORS.grayMedium2,
        }}
        variant="body2"
      >
        ETH
      </Typography>
    </StyledAddressSwitch>
  )
}
