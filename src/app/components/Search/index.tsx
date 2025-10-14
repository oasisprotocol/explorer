import { FC, FormEvent, memo, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { SearchScope } from '../../../types/searchScope'
import { textSearchMinimumLength } from './search-utils'
import { isValidBlockHeight } from '../../utils/helpers'
import { typingDelay } from '../../../styles/theme'
import { isValidMnemonic } from '../../utils/helpers'
import { getAppTitle } from '../../../config'
import { SearchInput } from '@oasisprotocol/ui-library/src/components/input'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

export type SearchVariant = 'button' | 'icon' | 'expandable'

export interface SearchProps {
  scope?: SearchScope
  variant: SearchVariant
  disabled?: boolean
  onFocusChange?: (hasFocus: boolean) => void
}

export const Search: FC<SearchProps> = ({ scope, variant, disabled, onFocusChange: onFocusChangeProp }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isMobile } = useScreenSize()
  const searchPlaceholderTranslated = isMobile ? t('search.mobilePlaceholder') : t('search.placeholder')
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const valueInSearchParams = useSearchParams()[0].get('q') ?? ''
  const [isProblemFresh, setIsProblemFresh] = useState(false)

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
  const hasWarning = !!warningMessage
  const hasProblem = hasError || hasWarning

  useEffect(() => {
    if (hasProblem) {
      const timeout = setTimeout(() => {
        setIsProblemFresh(false)
      }, typingDelay)
      return () => clearTimeout(timeout)
    } else {
      setIsProblemFresh(true)
    }
  }, [hasProblem])

  return (
    <form
      className="flex gap-2"
      onSubmit={onFormSubmit}
      role="search"
      aria-label={searchPlaceholderTranslated}
    >
      <SearchInput
        className=""
        size="lg"
        onChange={onChange}
        placeholder={searchPlaceholderTranslated}
        value={value}
      />
      <Button
        className={cn('', variant === 'icon' && '!px-2.5')}
        onClick={onFormSubmit}
        disabled={disabled || hasProblem}
        type="submit"
        size="lg"
      >
        {variant !== 'button' ? (
          <SearchIcon sx={{ color: COLORS.grayMediumLight }} />
        ) : (
          t('search.searchBtnText')
        )}
      </Button>
    </form>
  )
}
