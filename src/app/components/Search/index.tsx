import { ChangeEvent, FC, FormEvent, memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { InputAdornment } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import { SearchUtils } from './search-utils'
import { StandardTextFieldProps } from '@mui/material/TextField/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import IconButton from '@mui/material/IconButton'
import ClickAwayListener from '@mui/base/ClickAwayListener'

export type SearchVariant = 'button' | 'icon' | 'expandable'

interface StyledBaseProps {
  searchVariant: SearchVariant
  expanded: boolean
}

interface SearchFormProps extends StyledBaseProps {}

const SearchForm = styled('form', {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['expanded', 'searchVariant'] as (keyof SearchFormProps)[]).includes(prop as keyof SearchFormProps),
})<SearchFormProps>(({ searchVariant, expanded }) => ({
  ...(searchVariant === 'expandable'
    ? {
        position: 'absolute',
        ...(expanded
          ? {
              left: 0,
              width: '100%',
            }
          : {}),
      }
    : {
        position: 'relative',
        width: '100%',
      }),
}))

interface SearchTextFieldProps extends StandardTextFieldProps {
  searchVariant: SearchVariant
  expanded: boolean
  hasStartAdornment: boolean
}

const SearchTextField = styled(TextField, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['searchVariant', 'expanded', 'hasStartAdornment'] as (keyof SearchTextFieldProps)[]).includes(
      prop as keyof SearchTextFieldProps,
    ),
})<SearchTextFieldProps>(({ theme, searchVariant, expanded, hasStartAdornment }) => ({
  ...(hasStartAdornment
    ? {}
    : {
        paddingLeft: theme.spacing(4),
      }),
  ...(searchVariant === 'expandable'
    ? {
        ...(expanded
          ? {}
          : {
              paddingLeft: 0,
              input: {
                display: 'none',
              },
            }),
      }
    : {}),
}))

interface InputEndAdornmentProps extends StyledBaseProps {}

const InputEndAdornment = styled(InputAdornment, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['expanded', 'searchVariant'] as (keyof InputEndAdornmentProps)[]).includes(
      prop as keyof InputEndAdornmentProps,
    ),
})<InputEndAdornmentProps>(({ searchVariant, expanded }) => ({
  ...(searchVariant === 'expandable'
    ? {
        ...(expanded
          ? {}
          : {
              marginLeft: 0,
            }),
      }
    : {}),
}))

interface SearchButtonProps extends StyledBaseProps {}

const SearchButton = styled(Button, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['expanded', 'searchVariant'] as (keyof SearchButtonProps)[]).includes(prop as keyof SearchButtonProps),
})<SearchButtonProps>(({ theme, searchVariant }) => ({
  minWidth: 'unset',
  padding: '12px',
  [theme.breakpoints.up('sm')]: {
    ...(searchVariant === 'button'
      ? {
          paddingLeft: theme.spacing(5),
          paddingRight: theme.spacing(5),
        }
      : {}),
  },
  ...(searchVariant === 'expandable'
    ? {
        backgroundColor: COLORS.brandDark,
      }
    : {}),
}))

export interface SearchProps {
  variant: SearchVariant
  disabled?: boolean
  onFocusChange?: (hasFocus: boolean) => void
}

const SearchCmp: FC<SearchProps> = ({ variant, disabled, onFocusChange }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const searchPlaceholderTranslated = isMobile ? t('search.mobilePlaceholder') : t('search.placeholder')
  const searchTermRequiredTranslated = t('search.searchTermRequired')
  const [value, setValue] = useState('')
  const [expanded, setExpanded] = useState(variant !== 'expandable')
  const [hasError, setHasError] = useState(false)

  const onSearchSubmit = (searchTerm: string) => {
    try {
      const navigateTo = SearchUtils.getNavigationPath(searchTerm)
      navigate(navigateTo)
    } catch (ex) {
      console.error(ex)
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const onFormSubmit = (e?: FormEvent) => {
    e?.preventDefault()

    setHasError(false)

    if (!value) {
      setHasError(true)

      return
    }

    onSearchSubmit(value)
  }

  const onSearchButtonClick = () => {
    if (expanded) {
      onFormSubmit()
    } else {
      setExpanded(true)
    }
  }

  const onClearValue = () => {
    setValue('')
  }

  const startAdornment = variant === 'button' && (
    <InputAdornment position="start">
      <SearchIcon sx={{ color: COLORS.grayMedium }} />
    </InputAdornment>
  )

  const searchButtonContent =
    variant !== 'button' ? <SearchIcon sx={{ color: COLORS.grayMedium }} /> : t('search.searchBtnText')

  return (
    <ClickAwayListener onClickAway={() => setExpanded(false)}>
      <SearchForm
        expanded={expanded}
        searchVariant={variant}
        onSubmit={onFormSubmit}
        role="search"
        aria-label={searchPlaceholderTranslated}
      >
        <SearchTextField
          expanded={expanded}
          searchVariant={variant}
          hasStartAdornment={!!startAdornment}
          value={value}
          onChange={onChange}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          InputProps={{
            inputProps: {
              sx: { p: 0 },
            },
            startAdornment,
            endAdornment: (
              <InputEndAdornment position="end" expanded={expanded} searchVariant={variant}>
                <>
                  {variant === 'icon' && value && (
                    <IconButton color="inherit" onClick={onClearValue}>
                      <HighlightOffIcon />
                    </IconButton>
                  )}
                  <SearchButton
                    disabled={disabled}
                    expanded={expanded}
                    searchVariant={variant}
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={onSearchButtonClick}
                  >
                    {searchButtonContent}
                  </SearchButton>
                </>
              </InputEndAdornment>
            ),
          }}
          placeholder={searchPlaceholderTranslated}
          fullWidth
          error={hasError}
          aria-errormessage={searchTermRequiredTranslated}
        />
      </SearchForm>
    </ClickAwayListener>
    /*TODO: Add error message*/
  )
}

export const Search = memo(SearchCmp)
