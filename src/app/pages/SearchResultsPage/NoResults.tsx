import { FC } from 'react'
import Box from '@mui/material/Box'
import { EmptyState } from '../../components/EmptyState'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { SearchSuggestionsLinks } from '../../components/Search/SearchSuggestionsLinks'
import { OptionalBreak } from '../../components/OptionalBreak'
import { useTheme } from '@mui/material/styles'
import { getNameForScope, SearchScope } from '../../../types/searchScope'

export const NoResults: FC<{ scope?: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const title = !scope
    ? t('search.noResults.header')
    : t('search.noResults.scopeHeader', { scope: getNameForScope(t, scope) })

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
            <SearchSuggestionsLinks scope={scope} />
          </p>
        </Box>
      }
    />
  )
}
