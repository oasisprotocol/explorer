import { FC } from 'react'
import { Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import { ResultsInScope } from './ResultsInScope'
import { SearchQueries } from './hooks'
import Typography from '@mui/material/Typography'
import { getNameForScope, SearchScope } from '../../../types/searchScope'

/**
 * Component for selectively displaying a subset of search results that belongs to a specific scope, with appropriate theming.
 *
 * It doesn't actually run a search query, but uses existing results.
 * Except the theming, it relies on ResultsInScope.
 */
export const ResultsInScopeThemed: FC<{
  scope: SearchScope
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ scope, searchQueries, roseFiatValue }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const scopeName = getNameForScope(t, scope)
  const otherTheme = getThemesForNetworks()[scope.network]

  const content = <ResultsInScope scope={scope} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />

  return (
    <>
      <Typography variant="h1" color={theme.palette.layout.main}>
        {t('search.sectionHeader', { scope: scopeName })}
      </Typography>
      {scope.network === Network.mainnet ? (
        content
      ) : (
        <Box
          sx={{
            marginTop: 50,
            pt: 4,
            px: isMobile ? 0 : '4%',
            border: isMobile ? 'none' : `solid 15px ${otherTheme.palette.layout.border}`,
            background: otherTheme.palette.background.default,
          }}
        >
          {content}
        </Box>
      )}
    </>
  )
}
