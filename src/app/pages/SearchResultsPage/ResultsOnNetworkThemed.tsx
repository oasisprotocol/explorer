import { FC } from 'react'
import { getNetworkNames, Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import { ResultsOnNetwork } from './ResultsOnNetwork'
import Typography from '@mui/material/Typography'
import { SearchResults } from './hooks'
import { TokenPriceInfo } from '../../../coin-gecko/api'

/**
 * Component for selectively displaying a subset of search results that belongs to a specific network, with appropriate theming.
 *
 * It doesn't actually run a search query, but uses existing results.
 * Except the theming, it relies on ResultsOnNetwork.
 */
export const ResultsOnNetworkThemed: FC<{
  network: Network
  searchResults: SearchResults
  tokenPriceInfo: TokenPriceInfo
}> = ({ network, searchResults, tokenPriceInfo }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const networkName = getNetworkNames(t)[network]
  const otherTheme = getThemesForNetworks()[network]

  const content = (
    <ResultsOnNetwork network={network} searchResults={searchResults} tokenPriceInfo={tokenPriceInfo} />
  )

  return (
    <>
      <Typography variant="h1" color={theme.palette.layout.main}>
        {t('search.sectionHeader', { scope: networkName })}
      </Typography>
      {network === Network.mainnet ? (
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
