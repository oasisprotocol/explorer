import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ZoomIn from '@mui/icons-material/ZoomIn'
import ZoomOut from '@mui/icons-material/ZoomOut'
import {
  getFilterForNetwork,
  getInverseFilterForNetwork,
  getNetworkNames,
  isOnMainnet,
  Network,
} from '../../../types/network'
import {
  getFilterForScope,
  getNameForScope,
  getInverseFilterForScope,
  SearchScope,
} from '../../../types/searchScope'
import { getThemesForNetworks } from '../../../styles/theme'
import { RouteUtils } from '../../utils/route-utils'
import { SearchResults } from './hooks'
import { SearchResultsFiltered } from './SearchResultsFiltered'
import { NoResults } from './NoResults'
import { HasScope } from '../../../oasis-indexer/api'
import { AllTokenPrices } from '../../../coin-gecko/api'

const NotificationBox = styled(Box)(({ theme }) => ({
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

  border: `2px solid ${theme.palette.layout.darkBorder}`,

  borderRadius: 50,
}))

export const ScopedSearchResultsView: FC<{
  wantedScope: SearchScope
  searchResults: SearchResults
  tokenPrices: AllTokenPrices
}> = ({ wantedScope, searchResults, tokenPrices }) => {
  const { t } = useTranslation()
  const [othersOpen, setOthersOpen] = useState(false)
  const networkNames = getNetworkNames(t)
  const themes = getThemesForNetworks()
  const isInWantedScope = getFilterForScope(wantedScope)
  const isNotOnWantedNetwork = getInverseFilterForNetwork(wantedScope.network)
  const isNotInWantedScope = getInverseFilterForScope(wantedScope)
  const isOnWantedNetworkInOtherParatime = (item: HasScope) =>
    item.network === wantedScope.network && item.layer !== wantedScope.layer
  const hasWantedResults = searchResults.allResults.some(isInWantedScope)
  const otherResults = searchResults.allResults.filter(isNotInWantedScope)
  const hasMainnetResults = otherResults.some(isOnMainnet)
  const notificationTheme = themes[hasMainnetResults ? Network.mainnet : Network.testnet]

  const foundOtherResultsIn = [
    otherResults.some(isNotOnWantedNetwork) ? t('search.otherResults.Networks') : '',
    otherResults.some(isOnWantedNetworkInOtherParatime) ? t('search.otherResults.Paratimes') : '',
  ].filter(word => word)

  return (
    <>
      {hasWantedResults ? (
        <SearchResultsFiltered
          title={getNameForScope(t, wantedScope)}
          searchResults={searchResults}
          filter={isInWantedScope}
          tokenPrices={tokenPrices}
        />
      ) : (
        <NoResults scope={wantedScope} />
      )}
      {othersOpen ? (
        <>
          <NotificationBox theme={notificationTheme} onClick={() => setOthersOpen(false)}>
            <ZoomOut />
            <span>
              <Trans
                i18nKey={'search.otherResults.clickToHide'}
                values={{ locations: foundOtherResultsIn }}
              />
            </span>
          </NotificationBox>
          <SearchResultsFiltered
            title={t('search.otherResults.otherParatimesOnNetwork', {
              network: networkNames[wantedScope.network],
            })}
            filter={isOnWantedNetworkInOtherParatime}
            searchResults={searchResults}
            tokenPrices={tokenPrices}
          />
          {RouteUtils.getEnabledNetworks()
            .filter(net => net !== wantedScope.network)
            .map(net => (
              <SearchResultsFiltered
                key={net}
                title={networkNames[net]}
                filter={getFilterForNetwork(net)}
                searchResults={searchResults}
                tokenPrices={tokenPrices}
              />
            ))}
        </>
      ) : (
        !!otherResults.length && (
          <NotificationBox theme={notificationTheme} onClick={() => setOthersOpen(true)}>
            <ZoomIn />
            <span>
              <Trans
                t={t}
                i18nKey={
                  hasWantedResults
                    ? 'search.otherResults.clickToShowMore'
                    : 'search.otherResults.clickToShowThem'
                }
                values={{
                  countLabel: t(hasWantedResults ? 'search.results.moreCount' : 'search.results.count', {
                    count: otherResults.length,
                  }),
                  locations: foundOtherResultsIn,
                }}
              />
            </span>
          </NotificationBox>
        )
      )}
    </>
  )
}
