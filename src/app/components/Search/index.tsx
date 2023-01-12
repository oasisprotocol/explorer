import { FC, FormEvent, memo, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import { InputAdornment } from '@mui/material'
import SearchIcon from '../../icons/SearchIcon'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

const SearchForm = styled('form')(() => ({
  width: '100%',
}))

const SearchButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export interface SearchProps {
  onSearchSubmit: (searchTerm: string) => void
  onFocusChange?: (hasFocus: boolean) => void
}

const SearchCmp: FC<SearchProps> = ({ onSearchSubmit, onFocusChange }) => {
  const { t } = useTranslation()
  const searchPlaceholderTranslated = t('search.placeholder')
  const searchTermRequiredTranslated = t('search.searchTermRequired')

  const inputRef = useRef<HTMLInputElement>(null)
  const [hasError, setHasError] = useState(false)

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
          inputRef,
          onFocus,
          onBlur,
          inputProps: {
            sx: { p: 0 },
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <SearchButton color="primary" variant="contained" type="submit">
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
