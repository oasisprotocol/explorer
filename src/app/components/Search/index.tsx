import React, { FC, FormEvent, memo, useRef, useState } from 'react'
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
  textTransform: 'none',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export interface SearchProps {
  onSearchSubmit: (searchTerm: string) => void
}

const SearchCmp: FC<SearchProps> = ({ onSearchSubmit }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasError, setHasError] = useState(false)

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
    <SearchForm onSubmit={onFormSubmit} role="search" aria-label={t('search.placeholder') ?? undefined}>
      <TextField
        InputProps={{
          inputRef,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <SearchButton color="primary" variant="contained" type="submit">
                {t('search.searchButtonText')}
              </SearchButton>
            </InputAdornment>
          ),
        }}
        placeholder={t('search.placeholder') ?? undefined}
        fullWidth
        error={hasError}
        aria-errormessage={t('search.searchTermRequired') ?? undefined}
      />
    </SearchForm>
    /*TODO: Add error message*/
  )
}

export const Search = memo(SearchCmp)
