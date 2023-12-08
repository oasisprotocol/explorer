import { FC } from 'react'
import Box from '@mui/material/Box'
import { EmptyState } from '../../components/EmptyState'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { SearchSuggestionsLinksForNoResults } from '../../components/Search/SearchSuggestionsLinksForNoResults'
import { OptionalBreak } from '../../components/OptionalBreak'
import { useTheme } from '@mui/material/styles'
import { getNameForScope, SearchScope } from '../../../types/searchScope'
import { getNetworkNames, Network } from '../../../types/network'
import { Layer } from '../../../oasis-nexus/api'

export const NoResults: FC<{
  network?: Network
  layer?: Layer
}> = ({ network, layer }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const title = network
    ? t('search.noResults.scopeHeader', {
        scope: layer ? getNameForScope(t, { network, layer }) : getNetworkNames(t)[network],
      })
    : t('search.noResults.header')

  return (
    <EmptyState
      title={title}
      description={
        <Box
          sx={{ textAlign: 'center', a: { color: theme.palette.layout.main, textDecoration: 'underline' } }}
        >
          <p>
            <Trans
              t={t}
              i18nKey="search.noResults.description"
              components={{
                OptionalBreak: <OptionalBreak />,
                HomeLink: <Link component={RouterLink} to="/" />,
              }}
            />
          </p>
          <p>
            <SearchSuggestionsLinksForNoResults scope={layer && network ? { network, layer } : undefined} />
          </p>
        </Box>
      }
    />
  )
}

export const NoResultsWhatsoever: FC = () => <NoResults />
export const NoResultsOnNetwork: FC<{ network: Network }> = ({ network }) => <NoResults network={network} />

export const NoResultsOnMainnet: FC = () => <NoResultsOnNetwork network={Network.mainnet} />

export const NoResultsInScope: FC<{ scope: SearchScope }> = ({ scope }) => (
  <NoResults network={scope.network} layer={scope.layer} />
)
