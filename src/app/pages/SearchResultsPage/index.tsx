import { FC } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { PageLayout } from '../../components/PageLayout'
import { useParamSearch } from '../../components/Search/search-utils'
import { EmptyState } from '../../components/EmptyState'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { SearchSuggestionsLinks } from '../../components/Search/SearchSuggestionsLinks'
import { COLORS } from '../../../styles/theme/colors'
import { OptionalBreak } from '../../components/OptionalBreak'

export const SearchResultsPage: FC = () => {
  const searchQuery = useParamSearch()
  const { t } = useTranslation()

  return (
    <PageLayout>
      <Divider variant="layout" />
      <EmptyState
        title={t('search.noResults.header')}
        description={
          <Box sx={{ textAlign: 'center', a: { color: COLORS.white, textDecoration: 'underline' } }}>
            <p>
              <Trans
                t={t}
                i18nKey="search.noResults.description"
                components={{
                  OptionalBreak: <OptionalBreak />,
                  HomeLink: <Link component={RouterLink} to={'/'} />,
                }}
              ></Trans>
            </p>
            <p>
              <SearchSuggestionsLinks />
            </p>
          </Box>
        }
      />
    </PageLayout>
  )
}
