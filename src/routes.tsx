import { Outlet, RouteObject, ScrollRestoration, useNavigate } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { RuntimeBlocksPage } from './app/pages/RuntimeBlocksPage'
import { RuntimeTransactionsPage } from './app/pages/RuntimeTransactionsPage'
import { RuntimeTransactionDetailPage } from './app/pages/RuntimeTransactionDetailPage'
import { ParatimeDashboardPage } from './app/pages/ParatimeDashboardPage'
import { RuntimeBlockDetailPage } from './app/pages/RuntimeBlockDetailPage'
import { AccountDetailsPage, useAccountDetailsProps } from './app/pages/AccountDetailsPage'
import { AccountTransactionsCard } from './app/pages/AccountDetailsPage/AccountTransactionsCard'
import { AccountTokensCard } from './app/pages/AccountDetailsPage/AccountTokensCard'
import { SearchResultsPage } from './app/pages/SearchResultsPage'
import {
  addressParamLoader,
  blockHeightParamLoader,
  transactionParamLoader,
  assertEnabledScope,
  proposalIdParamLoader,
  fixedNetwork,
  hasFixedNetworkAndLayer,
  fixedLayer,
  isFixedOnParatime,
  isFixedOnConsensus,
  networkRoutePath,
  consensusRoutePath,
  layerRoutePath,
  RouteUtils,
} from './app/utils/route-utils'
import { searchParamLoader } from './app/components/Search/search-utils'
import { RoutingErrorPage } from './app/pages/RoutingErrorPage'
import { ThemeByNetwork, withDefaultTheme } from './app/components/ThemeByNetwork'
import { useRequiredScopeParam } from './app/hooks/useScopeParam'
import { TokensPage } from './app/pages/TokensOverviewPage'
import { ContractCodeCard } from './app/pages/AccountDetailsPage/ContractCodeCard'
import { TokenDashboardPage, useTokenDashboardProps } from './app/pages/TokenDashboardPage'
import { AccountTokenTransfersCard } from './app/pages/AccountDetailsPage/AccountTokenTransfersCard'
import { AccountNFTCollectionCard } from './app/pages/AccountDetailsPage/AccountNFTCollectionCard'
import { TokenTransfersCard } from './app/pages/TokenDashboardPage/TokenTransfersCard'
import { TokenHoldersCard } from './app/pages/TokenDashboardPage/TokenHoldersCard'
import { TokenInventoryCard } from './app/pages/TokenDashboardPage/TokenInventoryCard'
import { NFTInstanceDashboardPage, useNftDetailsProps } from './app/pages/NFTInstanceDashboardPage'
import { NFTMetadataCard } from './app/pages/NFTInstanceDashboardPage/NFTMetadataCard'
import { NFTTokenTransfersCard } from './app/pages/NFTInstanceDashboardPage/NFTTokenTransfersCard'
import { ConsensusDashboardPage } from 'app/pages/ConsensusDashboardPage'
import { ValidatorsPage } from './app/pages/ValidatorsPage'
import { ProposalsPage } from './app/pages/ProposalsPage'
import { ValidatorDetailsPage } from './app/pages/ValidatorDetailsPage'
import { Layer } from './oasis-nexus/api'
import { SearchScope } from './types/searchScope'
import { ProposalDetailsPage } from './app/pages/ProposalDetailsPage'
import { ConsensusBlocksPage } from './app/pages/ConsensusBlocksPage'
import { ConsensusAccountsPage } from './app/pages/ConsensusAccountsPage'
import { ConsensusTransactionsPage } from './app/pages/ConsensusTransactionsPage'
import { FC, useEffect } from 'react'

const NetworkSpecificPart = () => (
  <ThemeByNetwork network={useRequiredScopeParam().network}>
    <Outlet />
  </ThemeByNetwork>
)

/**
 * Use the passed RouteObject unless we have a fixed layer.
 *
 * Normally, this will just wrap the RouteObject into an array.
 * Unless the condition is true, because in that case, and empty array will be returned.
 */
const unlessFixedLayer = (route: RouteObject): RouteObject[] => (fixedLayer ? [] : [route])

/**
 * Use the passed RouteObject unless we have a fixed network and layer.
 *
 * Normally, this will just wrap the RouteObject into an array.
 * Unless the condition is true, because in that case, and empty array will be returned.
 */
const unlessFixedNetworkAndLayer = (route: RouteObject): RouteObject[] =>
  hasFixedNetworkAndLayer ? [] : [route]

/**
 * Use the passed RouteObject unless we are fixed on a ParaTime.
 *
 * Normally, this will just wrap the RouteObject into an array.
 * Unless the condition is true, because in that case, and empty array will be returned.
 */
const unlessFixedOnParatime = (route: RouteObject): RouteObject[] => (isFixedOnParatime ? [] : [route])

/**
 * Use the passed RouteObject unless we are fixed on consensus.
 *
 * Normally, this will just wrap the RouteObject into an array.
 * Unless the condition is true, because in that case, and empty array will be returned.
 */
const unlessFixedOnConsensus = (route: RouteObject): RouteObject[] => (isFixedOnConsensus ? [] : [route])

/**
 * Use the passed RouteObject if we have a fixed layer but no network
 *
 * Normally, this will just wrap the RouteObject into an array.
 * Unless the condition is true, because in that case, and empty array will be returned.
 */
const whenFixedLayerButNoNetwork = (route: RouteObject): RouteObject[] =>
  !!fixedLayer && !fixedNetwork ? [route] : []

/**
 * In case of being restricted to a specific layer, jump to a network
 *
 * This should be rendered on the landing page,
 * in order to redirect to a network, since we don't want the
 * opening graph.
 */
const RedirectToNetwork: FC = () => {
  const navigate = useNavigate()

  useEffect(() =>
    navigate(
      RouteUtils.getDashboardRoute({
        network: RouteUtils.getEnabledNetworksForLayer(fixedLayer!)[0]!,
        layer: fixedLayer!,
      }),
    ),
  )
  return null
}

export const routes: RouteObject[] = [
  {
    errorElement: <RoutingErrorPage />,
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    children: [
      ...unlessFixedLayer({
        path: '/',
        element: withDefaultTheme(<HomePage />, true),
      }),
      ...whenFixedLayerButNoNetwork({
        path: '/',
        element: <RedirectToNetwork />,
      }),
      ...unlessFixedNetworkAndLayer({
        path: '/search', // Global search
        element: withDefaultTheme(<SearchResultsPage />),
        loader: searchParamLoader,
      }),
      ...unlessFixedOnParatime({
        path: `${networkRoutePath}${consensusRoutePath}`,
        element: <NetworkSpecificPart />,
        errorElement: <RoutingErrorPage />,
        loader: async ({ params }): Promise<SearchScope> => {
          return assertEnabledScope({
            network: fixedNetwork ?? params._network,
            layer: Layer.consensus,
          })
        },
        id: 'consensusScope',
        children: [
          {
            path: '',
            element: <ConsensusDashboardPage />,
          },
          {
            path: `address`,
            element: <ConsensusAccountsPage />,
          },
          {
            path: `proposal`,
            element: <ProposalsPage />,
          },
          {
            path: `proposal/:proposalId`,
            element: <ProposalDetailsPage />,
            loader: proposalIdParamLoader,
          },
          {
            path: `validators`,
            element: <ValidatorsPage />,
          },
          {
            path: `validators/:address`,
            element: <ValidatorDetailsPage />,
            loader: addressParamLoader(),
          },
          {
            path: `block`,
            element: <ConsensusBlocksPage />,
          },
          {
            path: 'tx',
            element: <ConsensusTransactionsPage />,
          },
        ],
      }),
      ...unlessFixedOnConsensus({
        path: `${networkRoutePath}${layerRoutePath}`,
        element: <NetworkSpecificPart />,
        errorElement: <RoutingErrorPage />,
        loader: async ({ params }): Promise<SearchScope> => {
          return assertEnabledScope({
            network: fixedNetwork ?? params._network,
            layer: fixedLayer ?? params._layer,
          })
        },
        id: 'runtimeScope',
        children: [
          {
            path: '',
            element: <ParatimeDashboardPage />,
          },
          {
            path: 'search', // Search within this scope
            element: <SearchResultsPage />,
            loader: searchParamLoader,
          },

          {
            path: `block`,
            element: <RuntimeBlocksPage />,
          },
          {
            path: `block/:blockHeight`,
            element: <RuntimeBlockDetailPage />,
            loader: blockHeightParamLoader,
          },
          {
            path: `address/:address`,
            element: <AccountDetailsPage />,
            loader: addressParamLoader(),
            children: [
              {
                path: '',
                Component: () => <AccountTransactionsCard {...useAccountDetailsProps()} />,
              },
              {
                path: 'token-transfers',
                Component: () => <AccountTokenTransfersCard {...useAccountDetailsProps()} />,
              },
              {
                path: 'tokens/erc-20',
                Component: () => <AccountTokensCard {...useAccountDetailsProps()} type="ERC20" />,
              },
              {
                path: 'tokens/erc-721',
                children: [
                  {
                    path: '',
                    Component: () => <AccountTokensCard {...useAccountDetailsProps()} type="ERC721" />,
                  },
                  {
                    path: ':contractAddress',
                    Component: () => <AccountNFTCollectionCard {...useAccountDetailsProps()} />,
                    loader: addressParamLoader('contractAddress'),
                  },
                ],
              },
              {
                path: 'code',
                Component: () => <ContractCodeCard {...useAccountDetailsProps()} />,
              },
            ],
          },
          {
            path: `tx`,
            element: <RuntimeTransactionsPage />,
          },
          {
            path: `tx/:hash`,
            element: <RuntimeTransactionDetailPage />,
            loader: transactionParamLoader,
          },
          {
            path: `token`,
            element: <TokensPage />,
          },
          {
            path: 'token/:address/instance/:instanceId',
            element: <NFTInstanceDashboardPage />,
            loader: addressParamLoader(),
            children: [
              {
                path: '',
                Component: () => <NFTTokenTransfersCard {...useNftDetailsProps()} />,
              },
              {
                path: 'metadata',
                Component: () => <NFTMetadataCard {...useNftDetailsProps()} />,
              },
            ],
          },
          {
            path: `token/:address`,
            element: <TokenDashboardPage />,
            loader: addressParamLoader(),
            children: [
              {
                path: '',
                Component: () => <TokenTransfersCard {...useTokenDashboardProps()} />,
              },
              {
                path: 'holders',
                Component: () => <TokenHoldersCard {...useTokenDashboardProps()} />,
              },
              {
                path: 'inventory',
                Component: () => <TokenInventoryCard {...useTokenDashboardProps()} />,
              },
              {
                path: 'code',
                Component: () => <ContractCodeCard {...useTokenDashboardProps()} />,
              },
            ],
          },
        ],
      }),
    ],
  },
]
