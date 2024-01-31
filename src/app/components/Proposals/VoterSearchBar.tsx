import { FC } from 'react'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import InputAdornment from '@mui/material/InputAdornment'
import { COLORS } from '../../../styles/theme/colors'
import { SearchVariant } from '../Search'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'

export interface SearchBarProps {
  variant: SearchVariant
  value: string
  onChange: (value: string) => void
}

export const VoterSearchBar: FC<SearchBarProps> = ({ variant, value, onChange }) => {
  const { t } = useTranslation()
  const startAdornment = variant === 'button' && (
    <InputAdornment
      position="start"
      disablePointerEvents // Pass clicks through, so it focuses the input
    >
      <SearchIcon sx={{ color: COLORS.grayDark }} />
    </InputAdornment>
  )

  const onClearValue = () => onChange('')

  const endAdornment = (
    <InputAdornment position="end">
      <>
        {value && (
          <IconButton color="inherit" onClick={onClearValue}>
            <HighlightOffIcon />
          </IconButton>
        )}
      </>
    </InputAdornment>
  )

  return (
    <>
      <TextField
        value={value}
        onChange={e => onChange(e.target.value)}
        InputProps={{
          inputProps: {
            sx: {
              p: 0,
              marginRight: 2,
            },
          },
          startAdornment,
          endAdornment,
        }}
        placeholder={t('networkProposal.searchForVoters')}
        // FormHelperTextProps={{
        //   component: 'div', // replace p with div tag
        //   sx: {
        //     marginTop: 0,
        //     marginBottom: 0,
        //     marginLeft: variant === 'button' ? '48px' : '17px',
        //     marginRight: variant === 'button' ? '48px' : '17px',
        //   },
        // }}
      />
    </>
  )
}
