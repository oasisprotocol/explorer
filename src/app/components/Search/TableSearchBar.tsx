import { FC, KeyboardEventHandler, useCallback, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import InputAdornment from '@mui/material/InputAdornment'
import { COLORS } from '../../../styles/theme/colors'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { useScreenSize } from '../../hooks/useScreensize'
import WarningIcon from '@mui/icons-material/WarningAmber'
import { typingDelay } from '../../../styles/theme'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import MuiButton from '@mui/material/Button'
import { CardEmptyState } from '../CardEmptyState'
import { inputBaseClasses } from '@mui/material/InputBase'

type SearchBarSize = 'small' | 'medium' | 'large'

export interface TableSearchBarProps {
  placeholder: string
  warning?: string
  value: string
  /**
   * Should we go 100% width?
   */
  fullWidth?: boolean

  /**
   * Width of the whole component
   *
   * Note: fullWidth overrides this.
   */
  width?: string | number

  onChange: (value: string) => void
  onEnter?: () => void
  size?: SearchBarSize
  autoFocus?: boolean
}

type SizingInfo = {
  font: number | string
}

const sizeMapping: Record<SearchBarSize, SizingInfo> = {
  small: {
    font: '1em',
  },
  medium: {
    font: '1.25em',
  },
  large: {
    font: '1.5em',
  },
}

export const TableSearchBar: FC<TableSearchBarProps> = ({
  value,
  onChange,
  placeholder,
  warning,
  fullWidth,
  size = 'medium',
  autoFocus,
  onEnter,
  width = 250,
}) => {
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

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback(
    event => {
      if (event.key === 'Enter') {
        if (onEnter) onEnter()
      }
    },
    [onEnter],
  )

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
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearValue}
          className="hover:bg-black/[0.04] rounded-full -my-2 -ml-0.5"
        >
          <HighlightOffIcon />
        </Button>
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
        width: fullWidth ? '100%' : isTablet ? '160px' : undefined,
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
        '&:focus-within': {
          boxShadow: '3px 3px 3px 3px rgb(0, 0, 98, 0.125) !important',
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
        ...(fullWidth ? { width: '100%' } : {}),
      }}
      variant={'outlined'}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={handleKeyPress}
      InputProps={{
        inputProps: {
          sx: {
            p: 0,
            width: fullWidth ? '100%' : width,
            margin: 2,
            fontSize: sizeMapping[size].font,
          },
          autoFocus,
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
    <MuiButton variant={'text'} onClick={() => clearFilters()}>
      {t('tableSearch.clearFilters')}
    </MuiButton>
  )
  return <CardEmptyState label={t('tableSearch.noMatchingResults')} action={clearButton} />
}
