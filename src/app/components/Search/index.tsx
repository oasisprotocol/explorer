import { FC, FormEvent, memo, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TextField, { textFieldClasses } from '@mui/material/TextField'
import InputAdornment, { inputAdornmentClasses } from '@mui/material/InputAdornment'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import IconButton from '@mui/material/IconButton'
import { SearchSuggestionsButtons } from './SearchSuggestionsButtons'
import { formHelperTextClasses } from '@mui/material/FormHelperText'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import { SearchScope } from '../../../types/searchScope'

export type SearchVariant = 'button' | 'icon' | 'expandable'

interface StyledBaseProps {
  searchVariant: SearchVariant
}

interface SearchFormProps extends StyledBaseProps {}

const SearchForm = styled('form', {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['searchVariant'] as (keyof SearchFormProps)[]).includes(prop as keyof SearchFormProps),
})<SearchFormProps>(({ searchVariant }) => ({
  // Approximate size of TextField without helperText, so helperText floats.
  height: '47px',

  ...(searchVariant === 'expandable'
    ? {
        position: 'absolute',
        zIndex: 1,
        // Collapsed
        ':not(:hover, :focus-within)': {
          [`.${textFieldClasses.root}`]: {
            [`input, .${formHelperTextClasses.root}, .${outlinedInputClasses.notchedOutline}`]: {
              display: 'none',
            },
            [`.${inputAdornmentClasses.positionEnd}`]: {
              marginLeft: 0,
            },
          },
        },
        // Expanded
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

interface SearchButtonProps extends StyledBaseProps {}

export const SearchButton = styled(Button, {
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
SearchButton.defaultProps = {
  variant: 'contained',
  color: 'primary',
}

export interface SearchProps {
  scope?: SearchScope
  variant: SearchVariant
  disabled?: boolean
  onFocusChange?: (hasFocus: boolean) => void
}

const SearchCmp: FC<SearchProps> = ({ scope, variant, disabled, onFocusChange: onFocusChangeProp }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isMobile } = useScreenSize()
  const searchPlaceholderTranslated = isMobile ? t('search.mobilePlaceholder') : t('search.placeholder')
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const valueInSearchParams = useSearchParams()[0].get('q') ?? ''

  useEffect(() => {
    setValue(valueInSearchParams)
  }, [valueInSearchParams])

  const onFocusChange = (value: boolean) => {
    setIsFocused(value)
    onFocusChangeProp?.(value)
  }

  const onFormSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    if (value) {
      navigate(RouteUtils.getSearchRoute(scope, value))
    }
  }

  const onClearValue = () => {
    setValue('')
  }

  const startAdornment = variant === 'button' && (
    <InputAdornment
      position="start"
      disablePointerEvents // Pass clicks through, so it focuses the input
    >
      <SearchIcon sx={{ color: isFocused ? COLORS.grayMediumLight : COLORS.grayDark }} />
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
      <TextField
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        InputProps={{
          inputProps: {
            sx: { p: 0 },
          },
          startAdornment,
          endAdornment: (
            <InputAdornment position="end">
              <>
                {variant === 'icon' && value && (
                  <IconButton color="inherit" onClick={onClearValue}>
                    <HighlightOffIcon />
                  </IconButton>
                )}
                <SearchButton disabled={disabled} searchVariant={variant} type="submit">
                  {searchButtonContent}
                </SearchButton>
              </>
            </InputAdornment>
          ),
        }}
        placeholder={searchPlaceholderTranslated}
        fullWidth
        FormHelperTextProps={{
          sx: {
            marginTop: '10px',
            marginBottom: '10px',
            marginLeft: variant === 'button' ? '48px' : '17px',
            marginRight: variant === 'button' ? '48px' : '17px',
          },
        }}
        helperText={
          value &&
          value !== valueInSearchParams && (
            <SearchSuggestionsButtons
              onClickSuggestion={suggestion => {
                setValue(suggestion)
              }}
            />
          )
        }
      />
    </SearchForm>
  )
}

export const Search = memo(SearchCmp)
