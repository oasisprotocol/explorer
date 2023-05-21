import { FC, useState } from 'react'
import { getNetworkNames, Network } from '../../../types/network'
import { Trans, useTranslation } from 'react-i18next'
import { styled, useTheme } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import useMediaQuery from '@mui/material/useMediaQuery'
import { NetworkThemeBubble } from '../../components/NetworkThemeBubble'
import Box from '@mui/material/Box'
import { SearchResultsList } from './SearchResultsList'
import { SearchQueries } from './hooks'
import { COLORS } from '../../../styles/theme/colors'
import ZoomIn from '@mui/icons-material/ZoomIn'
import Warning from '@mui/icons-material/Warning'

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

export const ResultsOnForeignNetwork: FC<{
  network: Network
  hasLocalMatches: boolean
  openByDefault?: boolean
  searchQueries: SearchQueries
  matches: number
  roseFiatValue: number | undefined
}> = ({ network, searchQueries, matches, roseFiatValue, openByDefault = false, hasLocalMatches }) => {
  const [open, setOpen] = useState(openByDefault)
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const networkName = getNetworkNames(t)[network]
  if (!matches) {
    return null
  }
  const otherTheme = getThemesForNetworks()[network]

  if (!open) {
    return (
      <NetworkThemeBubble network={network}>
        <NotificationBox className={'foreignNote'} onClick={() => setOpen(true)}>
          <ZoomIn />
          {/*{countLabel}*/}
          <Trans
            t={t}
            i18nKey={
              hasLocalMatches ? 'search.otherResults.clickToShowMore' : 'search.otherResults.clickToShowThem'
            }
            values={{
              countLabel: t(hasLocalMatches ? 'search.results.moreCount' : 'search.results.count', {
                count: matches,
              }),
              networkName,
            }}
          />
        </NotificationBox>
      </NetworkThemeBubble>
    )
  }
  return (
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
        <SearchResultsList network={network} searchQueries={searchQueries} roseFiatValue={roseFiatValue} />
      </Box>
    </NetworkThemeBubble>
  )
}
