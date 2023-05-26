import { FC, useState } from 'react'
import { getNetworkNames, Network } from '../../../types/network'
import { Trans, useTranslation } from 'react-i18next'
import { styled, useTheme } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import { ResultsOnNetwork } from './ResultsOnNetwork'
import { COLORS } from '../../../styles/theme/colors'
import ZoomIn from '@mui/icons-material/ZoomIn'
import Warning from '@mui/icons-material/Warning'
import { SearchResults } from './hooks'

const NotificationBox = styled(Box)(({ theme }) => ({
  // TODO: this is probably not fully correct.
  marginTop: 10,
  marginBottom: 20,
  fontSize: 14,

  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px 10px',
  gap: 10,

  height: 50,

  background: theme.palette.background.default,
  border: `2px solid ${theme.palette.layout.border}`,
  color: theme.palette.layout.main,

  borderRadius: 50,
}))

/**
 * Component for selectively displaying a subset of search results that belongs to a specific foreign network,
 * with appropriate theming and collapse/open functionality.
 *
 * It doesn't actually run a search query, but uses existing results.
 * Except the theming and the collapse functionality, it relies on ResultsOnNetwork.
 */
export const ResultsOnForeignNetworkThemed: FC<{
  network: Network
  alsoHasLocalResults: boolean
  openByDefault?: boolean
  searchResults: SearchResults
  numberOfResults: number
  roseFiatValue: number | undefined
}> = ({
  network,
  searchResults,
  numberOfResults,
  roseFiatValue,
  openByDefault = false,
  alsoHasLocalResults,
}) => {
  const [open, setOpen] = useState(openByDefault)
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const networkName = getNetworkNames(t)[network]
  if (!numberOfResults) {
    return null
  }
  const otherTheme = getThemesForNetworks()[network]

  if (!open) {
    return (
      <NotificationBox theme={otherTheme} onClick={() => setOpen(true)}>
        <ZoomIn />
        <span>
          <Trans
            t={t}
            i18nKey={
              alsoHasLocalResults
                ? 'search.otherResults.clickToShowMore'
                : 'search.otherResults.clickToShowThem'
            }
            values={{
              countLabel: t(alsoHasLocalResults ? 'search.results.moreCount' : 'search.results.count', {
                count: numberOfResults,
              }),
              networkName,
            }}
          />
        </span>
      </NotificationBox>
    )
  }
  return (
    <Box
      sx={{
        marginTop: 50,
        pt: 4,
        px: isMobile ? 0 : '4%',
        border: isMobile ? 'none' : `solid 15px ${otherTheme.palette.layout.border}`,
        background: otherTheme.palette.background.default,
      }}
    >
      <NotificationBox
        sx={{
          background: COLORS.white, // TODO should come from theme
          color: COLORS.grayDark, // TODO should come from theme
          border: `2px solid ${otherTheme.palette.layout.border}`,
        }}
        onClick={() => setOpen(false)}
      >
        <Warning />
        {t('search.otherResults.clickToHide', { networkName })}
      </NotificationBox>
      <ResultsOnNetwork network={network} searchResults={searchResults} roseFiatValue={roseFiatValue} />
    </Box>
  )
}
