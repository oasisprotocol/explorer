import { FC } from 'react'
import { getNetworkNames, Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import { ResultsOnNetwork } from './ResultsOnNetwork'
import { SearchQueries } from './hooks'
import Typography from '@mui/material/Typography'

/**
 * Component for selectively displaying a subset of search results that belongs to a specific network, with appropriate theming.
 *
 * It doesn't actually run a search query, but uses existing results.
 * Except the theming, it relies on ResultsOnNetwork.
 */
export const ResultsOnNetworkThemed: FC<{
  network: Network
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ network, searchQueries, roseFiatValue }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const networkName = getNetworkNames(t)[network]
  const otherTheme = getThemesForNetworks()[network]

  const content = (
    <ResultsOnNetwork network={network} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />
  )

  return (
    <>
      <Typography variant="h1" color={theme.palette.layout.main}>
        {t('search.sectionHeader', { network: networkName })}
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
