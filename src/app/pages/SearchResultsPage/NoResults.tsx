import { FC } from 'react'
import Box from '@mui/material/Box'
import { EmptyState } from '../../components/EmptyState'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { SearchSuggestionsLinks } from '../../components/Search/SearchSuggestionsLinks'
import { OptionalBreak } from '../../components/OptionalBreak'
import { useTheme } from '@mui/material/styles'
import { getNetworkNames, GlobalNetwork, NetworkOrGlobal } from '../../../types/network'

export const NoResults: FC<{ network: NetworkOrGlobal }> = ({ network }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const title =
    network === GlobalNetwork
      ? t('search.noResults.header')
      : t('search.noResults.networkHeader', { network: getNetworkNames(t)[network] })

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
                HomeLink: <Link component={RouterLink} to={'/'} />,
              }}
            />
          </p>
          <p>
            <SearchSuggestionsLinks network={network} />
          </p>
        </Box>
      }
    />
  )
}
