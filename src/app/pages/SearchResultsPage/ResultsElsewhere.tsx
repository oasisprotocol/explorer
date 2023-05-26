import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { getThemesForNetworks } from '../../../styles/theme'
import Box from '@mui/material/Box'
import { SearchQueries } from './hooks'
import ZoomIn from '@mui/icons-material/ZoomIn'
import ZoomOut from '@mui/icons-material/ZoomOut'
import { getKeyForScope, getScopeForKey, SearchScope } from '../../../types/searchScope'
import { getNetworkNames, Network } from '../../../types/network'
import { RouteUtils } from '../../utils/route-utils'
import { ResultsFilteredThemed } from './ResultsFilteredThemed'

const NotificationBox = styled(Box)(({ theme }) => ({
  // TODO: this is probably not fully correct.
  marginTop: 30,
  marginBottom: 30,
  fontSize: 14,
  marginLeft: '10%',
  marginRight: '10%',

  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px 10px',
  gap: 10,

  height: 50,

  background: theme.palette.layout.notificationBackground,
  border: `2px solid ${theme.palette.layout.darkBorder}`,
  color: theme.palette.layout.notificationText,

  borderRadius: 50,
}))

export const ResultsElsewhere: FC<{
  wantedScope: SearchScope
  resultsInScopes: Record<string, number>
  searchQueries: SearchQueries
  roseFiatValue: number | undefined
}> = ({ wantedScope, resultsInScopes, searchQueries, roseFiatValue }) => {
  const { t } = useTranslation()
  const wantedScopeKey = getKeyForScope(wantedScope)
  const alsoHasWantedResults = !!resultsInScopes[wantedScopeKey]
  const otherScopesKeys = Object.keys(resultsInScopes)
    .filter(key => !!resultsInScopes[key])
    .filter(scopeKey => scopeKey !== wantedScopeKey)
  const otherScopes = otherScopesKeys.map(getScopeForKey)
  const hasResultsOnDifferentParatimes = otherScopes.some(
    scope => scope.network === wantedScope.network && scope.layer !== wantedScope.layer,
  )
  const hasResultsOnDifferentNetworks = otherScopes.some(scope => scope.network !== wantedScope.network)
  const hasAllKindsOfResults = hasResultsOnDifferentParatimes && hasResultsOnDifferentNetworks
  const location = t(
    hasAllKindsOfResults
      ? 'search.otherResults.otherNetworksAndParatimes'
      : hasResultsOnDifferentNetworks
      ? 'search.otherResults.otherNetworks'
      : 'search.otherResults.otherParatimes',
  )

  const totalNumberOfResults = otherScopesKeys.reduce(
    (partialSum, scopeKey) => partialSum + resultsInScopes[scopeKey],
    0,
  )

  // openByDefault={scope.network === Network.mainnet && !hasNoResultsInWantedScope}
  const openByDefault = false

  const [open, setOpen] = useState(openByDefault)

  const hasMainnetResults = otherScopes.some(scope => scope.network === Network.mainnet)

  const themes = getThemesForNetworks()
  const networkNames = getNetworkNames(t)

  const notificationTheme = hasMainnetResults ? themes[Network.mainnet] : themes[otherScopes[0].network]

  if (!otherScopes.length) return null

  const resultsInNetworks: Record<Network, number> = {} as any
  const allNetworks = RouteUtils.getEnabledNetworks()
  allNetworks.forEach(net => (resultsInNetworks[net] = 0))
  otherScopes.forEach(scope => (resultsInNetworks[scope.network] += resultsInScopes[scope.key]))

  if (!open) {
    return (
      <NotificationBox theme={notificationTheme} onClick={() => setOpen(true)}>
        <ZoomIn />
        <span>
          <Trans
            t={t}
            i18nKey={
              alsoHasWantedResults
                ? 'search.otherResults.clickToShowMore'
                : 'search.otherResults.clickToShowThem'
            }
            values={{
              countLabel: t(alsoHasWantedResults ? 'search.results.moreCount' : 'search.results.count', {
                count: totalNumberOfResults,
              }),
              location,
            }}
          />
        </span>
      </NotificationBox>
    )
  }

  return (
    <>
      <NotificationBox theme={notificationTheme} onClick={() => setOpen(false)}>
        <ZoomOut />
        <span>
          <Trans i18nKey={'search.otherResults.clickToHide'} values={{ location }} />
        </span>
      </NotificationBox>
      {hasResultsOnDifferentParatimes && (
        <ResultsFilteredThemed
          title={t('search.otherResults.otherParatimesOnNetwork', {
            network: networkNames[wantedScope.network],
          })}
          filter={item => item.network === wantedScope.network && item.layer !== wantedScope.layer}
          networkForTheme={wantedScope.network}
          searchQueries={searchQueries}
          numberOfResults={resultsInNetworks[wantedScope.network]}
          roseFiatValue={roseFiatValue}
        />
      )}
      {allNetworks
        .filter(net => net !== wantedScope.network && !!resultsInNetworks[net])
        .map(net => (
          <ResultsFilteredThemed
            key={net}
            networkForTheme={net}
            title={networkNames[net]}
            filter={item => item.network === net}
            searchQueries={searchQueries}
            numberOfResults={resultsInNetworks[net]}
            roseFiatValue={roseFiatValue}
          />
        ))}
    </>
  )
}
