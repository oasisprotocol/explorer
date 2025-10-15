import { FC, KeyboardEventHandler, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { CardEmptyState } from '../CardEmptyState'
import { SearchInput } from '@oasisprotocol/ui-library/src/components/input'

export interface TableSearchBarProps {
  className?: string
  placeholder: string
  warning?: string
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
  autoFocus?: boolean
}

export const TableSearchBar: FC<TableSearchBarProps> = ({
  className,
  value,
  onChange,
  placeholder,
  warning,
  autoFocus,
  onEnter,
}) => {
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback(
    event => {
      if (event.key === 'Enter') {
        if (onEnter) onEnter()
      }
    },
    [onEnter],
  )

  return (
    <SearchInput
      className={className}
      autoFocus={autoFocus}
      warning={warning}
      onChange={onChange}
      onKeyDown={handleKeyPress}
      placeholder={placeholder}
      value={value}
    />
  )
}

export const NoMatchingDataMaybeClearFilters: FC<{ clearFilters: () => void }> = ({ clearFilters }) => {
  const { t } = useTranslation()
  const clearButton = (
    <Button size="sm" variant="link" onClick={() => clearFilters()}>
      {t('tableSearch.clearFilters')}
    </Button>
  )
  return <CardEmptyState label={t('tableSearch.noMatchingResults')} action={clearButton} />
}
