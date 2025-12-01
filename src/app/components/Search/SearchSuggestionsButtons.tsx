import { FC } from 'react'
import { ButtonHTMLAttributes } from 'react'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Trans, useTranslation } from 'react-i18next'
import { searchSuggestionTerms } from './search-utils'
import { OptionalBreak } from '../OptionalBreak'
import { SearchScope } from '../../../types/searchScope'

export const SuggestionButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Button
    variant="link"
    className="
      gap-[0.2ch]
      text-xs
      px-0
      h-4
      text-inherit
      hover:no-underline
      focus-visible:outline-none
    "
    {...props}
  />
)

interface Props {
  scope: SearchScope | undefined
  onClickSuggestion: (suggestion: string) => void
}

export const SearchSuggestionsButtons: FC<Props> = ({ scope, onClickSuggestion }) => {
  const { t } = useTranslation()
  const { suggestedBlock, suggestedTransaction, suggestedAccount, suggestedTokenFragment } =
    (scope?.network && scope?.layer && searchSuggestionTerms[scope.network][scope.layer]) ??
    searchSuggestionTerms.mainnet.sapphire!
  const defaultComponents = {
    OptionalBreak: <OptionalBreak />,
    BlockLink: (
      <SuggestionButton
        onClick={() => onClickSuggestion(suggestedBlock)}
        onMouseDown={e => e.preventDefault()}
      />
    ),
    TransactionLink: (
      <SuggestionButton
        onClick={() => onClickSuggestion(suggestedTransaction)}
        onMouseDown={e => e.preventDefault()}
      />
    ),
    AccountLink: (
      <SuggestionButton
        onClick={() => onClickSuggestion(suggestedAccount)}
        onMouseDown={e => e.preventDefault()}
      />
    ),
  }
  const runtimeComponents = {
    ...defaultComponents,
    TokenLink: (
      <SuggestionButton
        onClick={() => onClickSuggestion(suggestedTokenFragment)}
        onMouseDown={e => e.preventDefault()}
      />
    ),
  }

  return (
    <Trans
      t={t}
      i18nKey={
        scope?.layer === 'consensus'
          ? 'search.searchSuggestionsForConsensus'
          : 'search.searchSuggestionsForRuntime'
      }
      components={scope?.layer === 'consensus' ? defaultComponents : runtimeComponents}
    />
  )
}
