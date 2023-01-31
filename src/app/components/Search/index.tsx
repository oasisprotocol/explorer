import { FC, FormEvent, memo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import { SearchUtils } from '../../components/Search/search-utils'

const SearchForm = styled('form')(() => ({
  width: '100%',
}))

const SearchButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export interface SearchProps {
  disabled?: boolean
  onFocusChange?: (hasFocus: boolean) => void
}

const SearchCmp: FC<SearchProps> = ({ disabled, onFocusChange }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const searchPlaceholderTranslated = t('search.placeholder')
  const searchTermRequiredTranslated = t('search.searchTermRequired')
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasError, setHasError] = useState(false)
  const onSearchSubmit = (searchTerm: string) => {
    try {
      const navigateTo = SearchUtils.getNavigationPath(searchTerm)
      navigate(navigateTo)
    } catch (ex) {
      console.error(ex)
    }
  }

  const onFocus = () => {
    onFocusChange?.(true)
  }

  const onBlur = () => {
    onFocusChange?.(false)
  }

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault()

    setHasError(false)

    const searchTerm = inputRef.current?.value
    if (!searchTerm) {
      setHasError(true)

      return
    }

    onSearchSubmit(searchTerm)
  }

  return (
    <SearchForm onSubmit={onFormSubmit} role="search" aria-label={searchPlaceholderTranslated}>
      <TextField
        InputProps={{
          disabled,
          inputRef,
          onFocus,
          onBlur,
          inputProps: {
            sx: { p: 0 },
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: COLORS.grayMedium }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <SearchButton disabled={disabled} color="primary" variant="contained" type="submit">
                {t('search.searchBtnText')}
              </SearchButton>
            </InputAdornment>
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
