import { ChangeEvent, FC, FormEvent, memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
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

export type SearchVariant = 'button' | 'icon' | 'expandable'

interface StyledBaseProps {
  searchVariant: SearchVariant
}

interface SearchFormProps extends StyledBaseProps {}

const SearchForm = styled('form', {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['searchVariant'] as (keyof SearchFormProps)[]).includes(prop as keyof SearchFormProps),
})<SearchFormProps>(({ searchVariant }) => ({
  ...(searchVariant === 'expandable'
    ? {
        position: 'absolute',
        ':hover, :focus-within': {
          left: 0,
          width: '100%',
        },
      }
    : {
        position: 'relative',
        width: '100%',
      }),
}))

interface SearchTextFieldProps extends StandardTextFieldProps {
  searchVariant: SearchVariant
}

const SearchTextField = styled(TextField, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['searchVariant'] as (keyof SearchTextFieldProps)[]).includes(
      prop as keyof SearchTextFieldProps,
    ),
})<SearchTextFieldProps>(({ searchVariant }) => ({
  ...(searchVariant === 'expandable'
    ? {
        ':not(:hover, :focus-within)': {
          input: {
            display: 'none',
          },
        },
      }
    : {}),
}))

interface InputEndAdornmentProps extends StyledBaseProps {}

const InputEndAdornment = styled(InputAdornment, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['searchVariant'] as (keyof InputEndAdornmentProps)[]).includes(prop as keyof InputEndAdornmentProps),
})<InputEndAdornmentProps>(({ searchVariant }) => ({
  ...(searchVariant === 'expandable'
    ? {
        ':not(:hover, :focus-within)': {
          marginLeft: 0,
        },
      }
    : {}),
}))

interface SearchButtonProps extends StyledBaseProps {}

const SearchButton = styled(Button, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['searchVariant'] as (keyof SearchButtonProps)[]).includes(prop as keyof SearchButtonProps),
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

  const onClearValue = () => {
    setValue('')
  }

  const startAdornment = variant === 'button' && (
    <InputAdornment
      position="start"
      disablePointerEvents // Pass clicks through, so it focuses the input
    >
      <SearchIcon sx={{ color: COLORS.grayMediumLight }} />
    </InputAdornment>
  )

  const searchButtonContent =
    variant !== 'button' ? <SearchIcon sx={{ color: COLORS.grayMediumLight }} /> : t('search.searchBtnText')

  return (
    <SearchForm
      searchVariant={variant}
      onSubmit={onFormSubmit}
      role="search"
      aria-label={searchPlaceholderTranslated}
    >
      <SearchTextField
        searchVariant={variant}
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
            <InputEndAdornment position="end" searchVariant={variant}>
              <>
                {variant === 'icon' && value && (
                  <IconButton color="inherit" onClick={onClearValue}>
                    <HighlightOffIcon />
                  </IconButton>
                )}
                <SearchButton
                  disabled={disabled}
                  searchVariant={variant}
                  color="primary"
                  variant="contained"
                  type="submit"
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
    /*TODO: Add error message*/
  )
}

export const Search = memo(SearchCmp)
