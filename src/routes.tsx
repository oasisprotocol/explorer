import { Outlet, RouteObject, ScrollRestoration, useNavigate } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { RuntimeBlocksPage } from './app/pages/RuntimeBlocksPage'
import { RuntimeTransactionsPage } from './app/pages/RuntimeTransactionsPage'
import { RuntimeTransactionDetailPage } from './app/pages/RuntimeTransactionDetailPage'
import { ParatimeDashboardPage } from './app/pages/ParatimeDashboardPage'
import { RuntimeBlockDetailPage } from './app/pages/RuntimeBlockDetailPage'
import {
  RuntimeAccountDetailsPage,
  useRuntimeAccountDetailsProps,
} from './app/pages/RuntimeAccountDetailsPage'
import { AccountTransactionsCard } from './app/pages/RuntimeAccountDetailsPage/AccountTransactionsCard'
import { AccountTokensCard } from './app/pages/RuntimeAccountDetailsPage/AccountTokensCard'
import { SearchResultsPage } from './app/pages/SearchResultsPage'
import {
  consensusAddressParamLoader,
  runtimeAddressParamLoader,
  blockHeightParamLoader,
  consensusTransactionParamLoader,
  runtimeTransactionParamLoader,
  assertEnabledScope,
  proposalIdParamLoader,
  fixedNetwork,
  fixedLayer,
  RouteUtils,
} from './app/utils/route-utils'
import { RoutingErrorPage } from './app/pages/RoutingErrorPage'
import { ThemeByNetwork, withDefaultTheme } from './app/components/ThemeByNetwork'
import { useRequiredScopeParam } from './app/hooks/useScopeParam'
import { TokensPage } from './app/pages/TokensOverviewPage'
import { ContractCodeCard } from './app/pages/RuntimeAccountDetailsPage/ContractCodeCard'
import { TokenDashboardPage, useTokenDashboardProps } from './app/pages/TokenDashboardPage'
import { AccountTokenTransfersCard } from './app/pages/RuntimeAccountDetailsPage/AccountTokenTransfersCard'
import { AccountNFTCollectionCard } from './app/pages/RuntimeAccountDetailsPage/AccountNFTCollectionCard'
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
import { useValidatorDetailsProps } from './app/pages/ValidatorDetailsPage/hooks'
import { DebondingDelegationsCard } from './app/pages/ValidatorDetailsPage/DebondingDelegationsCard'
import { DelegatorsCard } from './app/pages/ValidatorDetailsPage/DelegatorsCard'
import { Layer } from './oasis-nexus/api'
import { SearchScope } from './types/searchScope'
import { ProposalDetailsPage } from './app/pages/ProposalDetailsPage'
import { ConsensusBlocksPage } from './app/pages/ConsensusBlocksPage'
import { ConsensusBlockDetailPage } from './app/pages/ConsensusBlockDetailPage'
import { ConsensusAccountsPage } from './app/pages/ConsensusAccountsPage'
import { ConsensusTransactionsPage } from './app/pages/ConsensusTransactionsPage'
import { ConsensusTransactionDetailPage } from './app/pages/ConsensusTransactionDetailPage'
import { ConsensusAccountDetailsPage } from './app/pages/ConsensusAccountDetailsPage'
import { useConsensusAccountDetailsProps } from './app/pages/ConsensusAccountDetailsPage/hooks'
import { ConsensusAccountTransactionsCard } from './app/pages/ConsensusAccountDetailsPage/ConsensusAccountTransactionsCard'
import { FC, useEffect } from 'react'
import { AnalyticsConsentProvider } from './app/components/AnalyticsConsent'

const NetworkSpecificPart = () => (
  <ThemeByNetwork isRootTheme={true} network={useRequiredScopeParam().network}>
    <Outlet />
  </ThemeByNetwork>
)

/**
 * In case of being restricted to a specific layer, jump to a dashboard
 *
 * This should be rendered on the landing page, since we don't want the opening graph.
 */
const RedirectToDashboard: FC = () => {
  const navigate = useNavigate()

  useEffect(() =>
    navigate(
      RouteUtils.getDashboardRoute({
        network: fixedNetwork ?? RouteUtils.getEnabledNetworksForLayer(fixedLayer!)[0]!,
        layer: fixedLayer!,
      }),
    ),
  )
  return null
}

export const routes: RouteObject[] = [
  {
    errorElement: (
      <AnalyticsConsentProvider>
        <RoutingErrorPage />
      </AnalyticsConsentProvider>
    ),
    element: (
      <AnalyticsConsentProvider>
        <ScrollRestoration />
        <Outlet />
      </AnalyticsConsentProvider>
    ),
    children: [
      {
        path: '/',
        element: fixedLayer ? <RedirectToDashboard /> : withDefaultTheme(<HomePage />, true),
      },
      ...(!!fixedNetwork && !!fixedLayer
        ? []
        : [
            {
              path: '/search', // Global search
              element: withDefaultTheme(<SearchResultsPage />),
            },
          ]),
      {
        path: '/:_network/consensus',
        element: <NetworkSpecificPart />,
        errorElement: <RoutingErrorPage />,
        loader: async ({ params }): Promise<SearchScope> => {
          return assertEnabledScope({ network: params._network, layer: Layer.consensus })
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
            path: `address/:address`,
            element: <ConsensusAccountDetailsPage />,
            loader: consensusAddressParamLoader(),
            children: [
              {
                path: '',
                Component: () => <ConsensusAccountTransactionsCard {...useConsensusAccountDetailsProps()} />,
              },
            ],
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
            loader: consensusAddressParamLoader(),
            children: [
              {
                path: '',
                Component: () => <ConsensusAccountTransactionsCard {...useValidatorDetailsProps()} />,
              },
              {
                path: 'delegators',
                Component: () => <DelegatorsCard {...useValidatorDetailsProps()} />,
              },
              {
                path: 'debonding-delegations',
                Component: () => <DebondingDelegationsCard {...useValidatorDetailsProps()} />,
              },
            ],
          },
          {
            path: `block`,
            element: <ConsensusBlocksPage />,
          },
          {
            path: `block/:blockHeight`,
            element: <ConsensusBlockDetailPage />,
            loader: blockHeightParamLoader,
          },
          {
            path: 'tx',
            element: <ConsensusTransactionsPage />,
          },
          {
            path: `tx/:hash`,
            element: <ConsensusTransactionDetailPage />,
            loader: consensusTransactionParamLoader,
          },
        ],
      },
      {
        path: '/:_network/:_layer',
        element: <NetworkSpecificPart />,
        errorElement: <RoutingErrorPage />,
        loader: async ({ params }): Promise<SearchScope> => {
          return assertEnabledScope({ network: params._network, layer: params._layer })
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
            element: <RuntimeAccountDetailsPage />,
            loader: runtimeAddressParamLoader(),
            children: [
              {
                path: '',
                Component: () => <AccountTransactionsCard {...useRuntimeAccountDetailsProps()} />,
              },
              {
                path: 'token-transfers',
                Component: () => <AccountTokenTransfersCard {...useRuntimeAccountDetailsProps()} />,
              },
              {
                path: 'tokens/erc-20',
                Component: () => <AccountTokensCard {...useRuntimeAccountDetailsProps()} type="ERC20" />,
              },
              {
                path: 'tokens/erc-721',
                children: [
                  {
                    path: '',
                    Component: () => <AccountTokensCard {...useRuntimeAccountDetailsProps()} type="ERC721" />,
                  },
                  {
                    path: ':contractAddress',
                    Component: () => <AccountNFTCollectionCard {...useRuntimeAccountDetailsProps()} />,
                    loader: runtimeAddressParamLoader('contractAddress'),
                  },
                ],
              },
              {
                path: 'code',
                Component: () => <ContractCodeCard {...useRuntimeAccountDetailsProps()} />,
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
            loader: runtimeTransactionParamLoader,
          },
          {
            path: `token`,
            element: <TokensPage />,
          },
          {
            path: 'token/:address/instance/:instanceId',
            element: <NFTInstanceDashboardPage />,
            loader: runtimeAddressParamLoader(),
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
            loader: runtimeAddressParamLoader(),
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
      },
    ],
  },
]
