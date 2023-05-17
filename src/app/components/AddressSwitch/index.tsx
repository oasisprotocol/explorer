import Switch, { switchClasses } from '@mui/material/Switch'
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
  [`& .${switchClasses.switchBase}`]: {
    margin: 2,
    padding: 0,
    transform: 'translateX(1px)',
    [`&.${switchClasses.checked}`]: {
      transform: 'translateX(31px)',
      [`& .${switchClasses.thumb}`]: {
        backgroundColor: COLORS.lightSilver,
        '&:before': {
          backgroundImage: `url("${ethLogo}")`,
        },
      },
      [`& + .${switchClasses.track}`]: {
        opacity: 1,
        backgroundColor: COLORS.grayMedium2,
      },
    },
  },
  [`& .${switchClasses.thumb}`]: {
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
  [`& .${switchClasses.track}`]: {
    opacity: 1,
    backgroundColor: COLORS.grayMedium2,
    borderRadius: '50px',
  },
}))

export enum AddressSwitchOption {
  Oasis = 'oasis',
  ETH = 'eth',
}

interface AddressSwitchProps {
  selected?: AddressSwitchOption.Oasis | AddressSwitchOption.ETH
  onSelectionChange: (selection: AddressSwitchOption.Oasis | AddressSwitchOption.ETH) => void
}

export const AddressSwitch: FC<AddressSwitchProps> = ({
  selected = AddressSwitchOption.ETH,
  onSelectionChange,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const checked = selected === AddressSwitchOption.ETH

  const onChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onSelectionChange(checked ? AddressSwitchOption.ETH : AddressSwitchOption.Oasis)
  }

  return (
    <StyledAddressSwitch>
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
            selected === AddressSwitchOption.ETH
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
