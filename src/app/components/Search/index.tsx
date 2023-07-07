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
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import IconButton from '@mui/material/IconButton'
import { SearchSuggestionsButtons } from './SearchSuggestionsButtons'
import { formHelperTextClasses } from '@mui/material/FormHelperText'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import { SearchScope } from '../../../types/searchScope'
import { textSearchMininumLength } from './search-utils'
import Typography from '@mui/material/Typography'
import { isValidBlockHeight } from '../../utils/helpers'
import { isValidMnemonic } from '../../utils/helpers'

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

  const wordsOfPower = t('search.wordsOfPower')
  const hasWordsOfPower = value.trim().toLowerCase().startsWith(wordsOfPower.toLowerCase())
  const valueWithoutPrefix = hasWordsOfPower
    ? value.trim().substring(wordsOfPower.length).trim()
    : value.trim()

  const isTooShort =
    !!value && valueWithoutPrefix.length < textSearchMininumLength && !isValidBlockHeight(valueWithoutPrefix)

  const hasPrivacyProblem = !hasWordsOfPower && isValidMnemonic(valueWithoutPrefix)

  useEffect(() => {
    setValue(hasWordsOfPower ? `${wordsOfPower} ${valueInSearchParams}` : valueInSearchParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueInSearchParams]) // We only want to update the value from code when the URL changes

  const onChange = (newValue: string) => {
    setValue(newValue)
  }

  const onFocusChange = (value: boolean) => {
    setIsFocused(value)
    onFocusChangeProp?.(value)
  }

  const onFormSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    if (value) {
      navigate(RouteUtils.getSearchRoute(scope, valueWithoutPrefix))
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

  const errorMessage = isTooShort ? t('search.error.tooShort') : undefined
  const hasError = !!errorMessage

  const warningMessage = hasPrivacyProblem
    ? t('search.error.privacy', { appName: t('appName'), wordsOfPower })
    : undefined
  const hasWarning = !!warningMessage

  return (
    <SearchForm
      searchVariant={variant}
      onSubmit={onFormSubmit}
      role="search"
      aria-label={searchPlaceholderTranslated}
    >
      <TextField
        sx={{
          ...(hasWarning && !hasError
            ? {
                [`& .${outlinedInputClasses.error} .${outlinedInputClasses.notchedOutline}`]: {
                  borderColor: COLORS.warningColor,
                },
              }
            : {}),
        }}
        value={value}
        onChange={e => onChange(e.target.value)}
        error={hasError || hasWarning}
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
                {value && (
                  <IconButton color="inherit" onClick={onClearValue}>
                    <HighlightOffIcon />
                  </IconButton>
                )}
                <SearchButton
                  disabled={disabled || hasError || hasWarning}
                  searchVariant={variant}
                  type="submit"
                >
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
            <>
              {hasError && (
                <>
                  <Typography
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      color: COLORS.errorIndicatorBackground,
                      fontSize: 12,
                      lineHeight: 2,
                      alignItems: 'center',
                      verticalAlign: 'middle',
                      mt: 3,
                      mb: 4,
                    }}
                  >
                    <ErrorIcon sx={{ mr: 3 }} />
                    {errorMessage}
                  </Typography>
                  <br />
                </>
              )}
              {hasWarning && (
                <>
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
                    }}
                  >
                    <WarningIcon sx={{ mr: 3 }} />
                    {warningMessage}
                  </Typography>
                  <br />
                </>
              )}
              <SearchSuggestionsButtons
                scope={scope}
                onClickSuggestion={suggestion => {
                  setValue(suggestion)
                }}
              />
            </>
          )
        }
      />
    </SearchForm>
  )
}

export const Search = memo(SearchCmp)
