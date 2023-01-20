import { FC, FormEvent, memo, useRef, useState } from 'react'
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

export type SearchVariant = 'button' | 'icon' | 'expandable'

interface StyledBaseProps {
  searchVariant: SearchVariant
  expanded: boolean
}

interface SearchFormProps extends StyledBaseProps {}

const SearchForm = styled('form', {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['expanded', 'searchVariant'] as (keyof SearchFormProps)[]).includes(prop as keyof SearchFormProps),
})<SearchFormProps>(({ theme, searchVariant, expanded }) => ({
  ...(searchVariant === 'expandable'
    ? {
        position: 'absolute',
        right: theme.spacing(4),

        ...(expanded
          ? {
              left: theme.spacing(4),
              width: `calc(100% - ${theme.spacing(4)} - ${theme.spacing(4)})`,
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
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
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

const blurTimeout = 16

const SearchCmp: FC<SearchProps> = ({ variant, disabled, onFocusChange }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const searchPlaceholderTranslated = isMobile ? t('search.mobilePlaceholder') : t('search.placeholder')
  const searchTermRequiredTranslated = t('search.searchTermRequired')
  const inputRef = useRef<HTMLInputElement>(null)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  const setBlurTimeout = (fn: () => void) => {
    if (variant !== 'expandable') {
      return
    }

    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current)
    }

    blurTimeoutRef.current = setTimeout(fn, blurTimeout)
  }

  const onFocus = () => {
    setBlurTimeout(() => {
      setExpanded(true)
    })

    onFocusChange?.(true)
  }

  const onSearchButtonBlur = () => {
    setBlurTimeout(() => {
      setExpanded(false)
    })
  }

  const onBlur = () => {
    setBlurTimeout(() => {
      setExpanded(false)
    })

    onFocusChange?.(false)
  }

  const onFormSubmit = (e?: FormEvent) => {
    e?.preventDefault()

    setHasError(false)

    const searchTerm = inputRef.current?.value
    if (!searchTerm) {
      setHasError(true)

      return
    }

    onSearchSubmit(searchTerm)
  }

  const onSearchButtonClick = () => {
    if (expanded) {
      onFormSubmit()
    } else {
      setExpanded(true)
    }
  }

  const startAdornment = variant === 'button' && (
    <InputAdornment position="start">
      <SearchIcon sx={{ color: COLORS.grayMedium }} />
    </InputAdornment>
  )

  const searchButtonContent =
    variant !== 'button' ? <SearchIcon sx={{ color: COLORS.grayMedium }} /> : t('search.searchBtnText')

  return (
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
        InputProps={{
          disabled,
          inputRef,
          onFocus,
          onBlur,
          inputProps: {
            sx: { p: 0 },
          },
          startAdornment,
          endAdornment: (
            <InputEndAdornment position="end" expanded={expanded} searchVariant={variant}>
              <SearchButton
                disabled={disabled}
                expanded={expanded}
                searchVariant={variant}
                color="primary"
                variant="contained"
                type="submit"
                onClick={onSearchButtonClick}
                onBlur={onSearchButtonBlur}
              >
                {searchButtonContent}
              </SearchButton>
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
