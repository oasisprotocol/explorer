import { FC } from 'react'

import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Network } from '../../../types/network'
import { SearchQueries } from './hooks'
import { getThemesForNetworks } from '../../../styles/theme'
import { ResultsInNetwork } from './ResultsInNetwork'
import { useTranslation } from 'react-i18next'
import { SubPageCard } from '../../components/SubPageCard'

export const ResultListFrame = styled(Box)(({ theme }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return {
    marginBottom: 20,
    border: isMobile ? 'none' : `solid 15px ${theme.palette.layout.networkBubbleBorder}`,
    background: theme.palette.layout.networkBubbleBackground,
    borderRadius: 12,
    '&& > div > div': {
      // border: '2px solid green',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      paddingLeft: 64,
      paddingRight: 64,
      background: theme.palette.layout.networkBubbleBackground,
    },
    '&& > div > div > div.MuiBox-root': {
      background: theme.palette.layout.networkBubbleBorder,
      borderRadius: 0,
      // border: '2px solid red',
      marginLeft: -64,
      marginTop: -32,
      marginRight: -64,
      paddingLeft: 64,
      paddingRight: 64,
      paddingBottom: 32,
      paddingTop: 32,
    },
    '&& > div > div > div.MuiCardContent-root': {},
  }
})

/**
 * Component for selectively displaying a subset of search results that belongs to a specific foreign network,
 * with appropriate theming.
 *
 * It doesn't actually run a search query, but uses existing results.
 * Except the theming and the collapse functionality, it relies on ResultsOnNetwork.
 */
export const ResultsInNetworkThemed: FC<{
  network: Network
  title: string
  searchQueries: SearchQueries
  numberOfResults: number
  roseFiatValue: number | undefined
}> = ({ network, title, searchQueries, numberOfResults, roseFiatValue }) => {
  const { t } = useTranslation()

  if (!numberOfResults) {
    return null
  }
  const otherTheme = getThemesForNetworks()[network]

  return (
    <ResultListFrame theme={otherTheme}>
      <SubPageCard
        title={title}
        featured
        subheader={t('search.results.count', {
          count: numberOfResults,
        })}
      >
        <ResultsInNetwork network={network} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />
      </SubPageCard>
    </ResultListFrame>
  )
}
