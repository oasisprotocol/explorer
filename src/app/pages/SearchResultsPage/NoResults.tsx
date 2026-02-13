import { FC } from 'react'
import { EmptyState } from '../../components/EmptyState'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { SearchSuggestionsLinksForNoResults } from '../../components/Search/SearchSuggestionsLinksForNoResults'
import { OptionalBreak } from '../../components/OptionalBreak'
import { getNameForScope, SearchScope } from '../../../types/searchScope'
import { getNetworkNames, Network } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'
import { ExploreOasisButton } from './ExploreOasisButton'

export const NoResults: FC<{
  network?: Network
  layer?: Layer
}> = ({ network, layer }) => {
  const { t } = useTranslation()
  const title = network
    ? t('search.noResults.scopeHeader', {
        scope: layer ? getNameForScope(t, { network, layer }) : getNetworkNames(t)[network],
      })
    : t('search.noResults.header')

  return (
    <EmptyState
      title={title}
      description={
        <div>
          <p>
            <span>
              <Trans
                t={t}
                i18nKey="search.noResults.description"
                components={{
                  OptionalBreak: <OptionalBreak />,
                  HomeLink: <RouterLink to="/" className="font-semibold" />,
                }}
              />
            </span>
          </p>
          <p>
            <SearchSuggestionsLinksForNoResults scope={layer && network ? { network, layer } : undefined} />
          </p>
          <ExploreOasisButton />
        </div>
      }
    />
  )
}

export const NoResultsWhatsoever: FC = () => <NoResults />
export const NoResultsOnNetwork: FC<{ network: Network }> = ({ network }) => <NoResults network={network} />

export const NoResultsOnMainnet: FC = () => <NoResultsOnNetwork network="mainnet" />

export const NoResultsInScope: FC<{ scope: SearchScope }> = ({ scope }) => (
  <NoResults network={scope.network} layer={scope.layer} />
)
