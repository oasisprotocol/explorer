import Switch, { switchClasses } from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import HelpIcon from '@mui/icons-material/Help'
import Tooltip from '@mui/material/Tooltip'

const StyledAddressSwitch = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}))

const StyledSwitch = styled(Switch)(() => ({
  zoom: 2,
  margin: '-8px', // Reduce padding
  [`.${switchClasses.switchBase} .${switchClasses.thumb}`]: {
    // backgroundColor: 'black',
    backgroundColor: COLORS.brandMedium,
    // backgroundImage: `url("${oasisLogo}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '15px',
  },
  [`.${switchClasses.switchBase}.${switchClasses.checked} .${switchClasses.thumb}`]: {
    // backgroundColor: COLORS.lightSilver,
    // backgroundImage: `url("${ethLogo}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '10px',
  },
  [`&&&& .${switchClasses.track}`]: {
    opacity: 1,
    // backgroundColor: COLORS.grayMedium2,
  },
}))

export enum DataFormatSwitchOption {
  Hex = 'hex',
  Base64 = 'base64',
}

interface DataFormatSwitchProps {
  selected?: DataFormatSwitchOption.Hex | DataFormatSwitchOption.Base64
  onSelectionChange: (selection: DataFormatSwitchOption.Hex | DataFormatSwitchOption.Base64) => void
}

export const DataFormatSwitch: FC<DataFormatSwitchProps> = ({
  selected = DataFormatSwitchOption.Hex,
  onSelectionChange,
}) => {
  const { t } = useTranslation()

  const checked = selected === DataFormatSwitchOption.Base64

  const onChange = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onSelectionChange(checked ? DataFormatSwitchOption.Base64 : DataFormatSwitchOption.Hex)
  }

  return (
    <StyledAddressSwitch>
      <span>{t('dataFormatSwitch.label')}</span>
      <Tooltip title={t('dataFormatSwitch.explanation')}>
        <HelpIcon />
      </Tooltip>
      <Typography
        sx={{
          color: COLORS.brandExtraDark,
          fontSize: '10px',
        }}
      >
        {t('common.hex')}
      </Typography>
      <StyledSwitch checked={checked} onChange={onChange} title={'whatever'} />
      <Typography
        sx={{
          color: COLORS.brandExtraDark,
          fontSize: '10px',
        }}
      >
        {t('common.base64')}
      </Typography>
    </StyledAddressSwitch>
  )
}
