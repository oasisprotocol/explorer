import { FC, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import InputAdornment from '@mui/material/InputAdornment'
import { COLORS } from '../../../styles/theme/colors'
import IconButton from '@mui/material/IconButton'
import { useScreenSize } from '../../hooks/useScreensize'
import WarningIcon from '@mui/icons-material/WarningAmber'
import { typingDelay } from '../../../styles/theme'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import { CardEmptyState } from '../CardEmptyState'
import { inputBaseClasses } from '@mui/material/InputBase'

export interface TableSearchBarProps {
  placeholder: string
  warning?: string
  value: string
  onChange: (value: string) => void
}

export const TableSearchBar: FC<TableSearchBarProps> = ({ value, onChange, placeholder, warning }) => {
  const { isTablet } = useScreenSize()

  const [isWarningFresh, setIsWarningFresh] = useState(false)

  useEffect(() => {
    if (warning) {
      const timeout = setTimeout(() => {
        setIsWarningFresh(false)
      }, typingDelay)
      return () => clearTimeout(timeout)
    } else {
      setIsWarningFresh(true)
    }
  }, [warning])

  const startAdornment = (
    <InputAdornment
      position="start"
      disablePointerEvents // Pass clicks through, so it focuses the input
    >
      <SearchIcon sx={{ color: COLORS.grayDark, ml: -3 }} />
    </InputAdornment>
  )

  const onClearValue = () => onChange('')

  const endAdornment = (
    <InputAdornment position="end">
      {value ? (
        <IconButton color="inherit" sx={{ mt: -3, mb: -3, mr: -1 }} onClick={onClearValue}>
          <HighlightOffIcon />
        </IconButton>
      ) : (
        <span style={{ width: '38px' }} />
      )}
    </InputAdornment>
  )

  const helperText = isWarningFresh ? undefined : (
    <Typography
      component="span"
      sx={{
        display: 'inline-flex',
        color: COLORS.warningColor,
        fontSize: 12,
        lineHeight: 2,
        alignItems: 'center',
        verticalAlign: 'middle',
        mt: 3,
        mb: 4,
        width: isTablet ? '160px' : undefined,
      }}
    >
      <WarningIcon sx={{ mr: 3 }} />
      {warning}
    </Typography>
  )

  return (
    <TextField
      sx={{
        backgroundColor: COLORS.white,
        marginLeft: 4,
        marginRight: helperText ? '25px' : '25px',
        '&:focus-within': {
          boxShadow: '3px 3px 3px 3px rgb(0, 0, 98, 0.25) !important',
        },
        [`.${inputBaseClasses.root}`]: {
          border: '1px solid',
          borderColor: COLORS.inactiveStroke,
        },
        ...(helperText
          ? {
              border: '1px solid',
              borderColor: COLORS.inactiveStroke,
              marginBottom: isTablet ? '-99px' : '-50px',
            }
          : {}),
        zIndex: 10,
      }}
      variant={'outlined'}
      value={value}
      onChange={e => onChange(e.target.value)}
      InputProps={{
        inputProps: {
          sx: {
            p: 0,
            width: isTablet ? 110 : 300,
            margin: 2,
          },
        },
        startAdornment,
        endAdornment,
      }}
      placeholder={placeholder}
      helperText={helperText}
    />
  )
}

export const NoMatchingDataMaybeClearFilters: FC<{ clearFilters: () => void }> = ({ clearFilters }) => {
  const { t } = useTranslation()
  const clearButton = (
    <Button variant={'text'} onClick={() => clearFilters()}>
      {t('tableSearch.clearFilters')}
    </Button>
  )
  return <CardEmptyState label={t('tableSearch.noMatchingResults')} action={clearButton} />
}
