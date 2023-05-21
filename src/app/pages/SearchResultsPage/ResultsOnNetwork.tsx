import { FC } from 'react'
import { getNetworkNames, Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import useMediaQuery from '@mui/material/useMediaQuery'
import { NetworkThemeBubble } from '../../components/NetworkThemeBubble'
import Box from '@mui/material/Box'
import { SearchResultsList } from './SearchResultsList'
import { SearchQueries } from './hooks'
import Typography from '@mui/material/Typography'

export const ResultsOnNetwork: FC<{
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
    <SearchResultsList network={network} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />
  )

  return (
    <>
      <Typography variant="h1" color={theme.palette.layout.main}>
        {t('search.sectionHeader', { network: networkName })}
      </Typography>
      {network === Network.mainnet ? (
        content
      ) : (
        <NetworkThemeBubble network={network}>
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
        </NetworkThemeBubble>
      )}
    </>
  )
}
