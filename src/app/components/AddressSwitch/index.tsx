import Switch from '@mui/material/Switch'
import { styled, useTheme } from '@mui/material/styles'
import oasisLogo from './images/oasis.svg'
import ethLogo from './images/eth.svg'
import { COLORS } from '../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'

const StyledAddressSwitch = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}))

const StyledSwitch = styled(Switch)(() => ({
  width: 75,
  height: 44,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 2,
    padding: 0,
    transform: 'translateX(1px)',
    '&.Mui-checked': {
      transform: 'translateX(31px)',
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
  Default = 'default',
  Oasis = 'oasis',
  Eth = 'eth',
}

interface AddressSwitchProps {
  selected?: AddressSwitchOption.Oasis | AddressSwitchOption.Eth
  onSelectionChange: (selection: AddressSwitchOption.Oasis | AddressSwitchOption.Eth) => void
}

export const AddressSwitch: FC<AddressSwitchProps> = ({
  selected = AddressSwitchOption.Oasis,
  onSelectionChange,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const checked = selected === AddressSwitchOption.Eth

  const onChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onSelectionChange(checked ? AddressSwitchOption.Eth : AddressSwitchOption.Oasis)
  }

  return (
    <StyledAddressSwitch>
      {!isMobile && (
        <Typography
          sx={{
            color: COLORS.grayMedium,
            fontSize: '10px',
            fontStyle: 'italic',
            mr: 3,
          }}
        >
          {t('addressSwitch.helpLabel')}
        </Typography>
      )}
      <Typography
        sx={{
          color:
            selected === AddressSwitchOption.Oasis
              ? isMobile
                ? COLORS.white
                : COLORS.brandExtraDark
              : COLORS.grayMedium2,
          fontSize: '10px',
        }}
      >
        {t('common.oasis')}
      </Typography>
      <StyledSwitch checked={checked} onChange={onChange} />
      <Typography
        sx={{
          color:
            selected === AddressSwitchOption.Eth
              ? isMobile
                ? COLORS.white
                : COLORS.brandExtraDark
              : COLORS.grayMedium2,
          fontSize: '10px',
        }}
      >
        {t('common.eth')}
      </Typography>
    </StyledAddressSwitch>
  )
}
