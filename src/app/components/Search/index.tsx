import { FC, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { SearchScope } from '../../../types/searchScope'
import { textSearchMinimumLength } from './search-utils'
import { isValidBlockHeight } from '../../utils/helpers'
import { isValidMnemonic } from '../../utils/helpers'
import { getAppTitle } from '../../../config'
import { SearchInput } from '@oasisprotocol/ui-library/src/components/input'
import { Search as SearchIcon } from 'lucide-react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { SearchSuggestionsButtons } from './SearchSuggestionsButtons'

export interface SearchProps {
  scope?: SearchScope
  disabled?: boolean
  onFocusChange?: (hasFocus: boolean) => void
  expandable?: boolean
  autoFocus?: boolean
}

export const Search: FC<SearchProps> = ({
  scope,
  expandable,
  disabled,
  onFocusChange: onFocusChangeProp,
  autoFocus,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isMobile } = useScreenSize()
  const searchPlaceholderTranslated = isMobile ? t('search.mobilePlaceholder') : t('search.placeholder')
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const valueInSearchParams = useSearchParams()[0].get('q') ?? ''

  const trimmedValue = value.trim()

  const isTooShort =
    !!value && trimmedValue.length < textSearchMinimumLength && !isValidBlockHeight(trimmedValue)

  useEffect(() => {
    setValue(valueInSearchParams)
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
    if (value && value !== valueInSearchParams) {
      navigate(RouteUtils.getSearchRoute(scope, trimmedValue))
    }
  }
  const errorMessage = isTooShort ? t('search.error.tooShort') : undefined
  const hasError = !!errorMessage
  const warningMessage = isValidMnemonic(trimmedValue)
    ? t('search.error.privacy', { appName: getAppTitle() })
    : undefined
  const hasProblem = hasError || !!warningMessage

  return (
    <div className="group flex justify-end">
      <form
        className={cn(
          'flex-1 flex gap-2 items-center',
          expandable && 'absolute h-10 group-hover:inset-x-0 group-focus-within:inset-x-0',
        )}
        onSubmit={onFormSubmit}
        role="search"
        aria-label={searchPlaceholderTranslated}
      >
        <SearchInput
          className={cn(
            '[&>svg]:max-lg:hidden [&>input]:max-lg:px-4 transition-shadow duration-300',
            expandable && 'hidden group-hover:flex group-focus-within:flex',
            isFocused && '[&>svg]:text-muted-foreground/50 shadow-[0_4px_50px_15px_rgba(0,0,98,0.54)]',
            '[&_input]:focus-visible:ring-[rgba(9,9,11,0.20)] rounded-md',
          )}
          size="lg"
          onChange={onChange}
          autoFocus={autoFocus}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          placeholder={searchPlaceholderTranslated}
          value={value}
          warning={errorMessage || warningMessage}
          hint={
            isFocused && (
              <SearchSuggestionsButtons
                scope={scope}
                onClickSuggestion={suggestion => {
                  setValue(suggestion)
                }}
              />
            )
          }
        />
        <Button
          className="max-lg:!px-2.5"
          onClick={onFormSubmit}
          disabled={disabled || hasProblem}
          type="submit"
          size="lg"
        >
          <SearchIcon className="lg:hidden" style={{ width: '20px', height: '20px' }} />
          <span className="max-lg:hidden">{t('search.searchBtnText')}</span>
        </Button>
      </form>
    </div>
  )
}
