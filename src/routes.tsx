import { Outlet, RouteObject, ScrollRestoration, useNavigate } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { RuntimeBlocksPage } from './app/pages/RuntimeBlocksPage'
import { RuntimeTransactionsPage } from './app/pages/RuntimeTransactionsPage'
import { RuntimeTransactionDetailPage } from './app/pages/RuntimeTransactionDetailPage'
import { ParatimeDashboardPage } from './app/pages/ParatimeDashboardPage'
import { RuntimeBlockDetailPage, useRuntimeBlockDetailsProps } from './app/pages/RuntimeBlockDetailPage'
import { RuntimeBlockTransactionsCard } from './app/pages/RuntimeBlockDetailPage/RuntimeBlockTransactionsCard'
import { RuntimeBlockEventsCard } from './app/pages/RuntimeBlockDetailPage/RuntimeBlockEventsCard'
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
  skipGraph,
  roflAppParamLoader,
} from './app/utils/route-utils'
import { RoutingErrorPage } from './app/pages/RoutingErrorPage'
import { ThemeByScope, withDefaultTheme } from './app/components/ThemeByScope'
import { useRequiredScopeParam } from './app/hooks/useScopeParam'
import { TokensPage } from './app/pages/TokensOverviewPage'
import { AccountEventsCard } from 'app/pages/RuntimeAccountDetailsPage/AccountEventsCard'
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
import { ConsensusBlockDetailPage, useConsensusBlockDetailsProps } from './app/pages/ConsensusBlockDetailPage'
import { ConsensusBlockTransactionsCard } from './app/pages/ConsensusBlockDetailPage/ConsensusBlockTransactionsCard'
import { ConsensusBlockEventsCard } from './app/pages/ConsensusBlockDetailPage/ConsensusBlockEventsCard'
import { ConsensusAccountsPage } from './app/pages/ConsensusAccountsPage'
import { ConsensusTransactionsPage } from './app/pages/ConsensusTransactionsPage'
import { ConsensusTransactionDetailPage } from './app/pages/ConsensusTransactionDetailPage'
import { ConsensusAccountDetailsPage } from './app/pages/ConsensusAccountDetailsPage'
import { ConsensusAccountEventsCard } from './app/pages/ConsensusAccountDetailsPage/ConsensusAccountEventsCard'
import { useConsensusAccountDetailsProps } from './app/pages/ConsensusAccountDetailsPage/hooks'
import { ConsensusAccountTransactionsCard } from './app/pages/ConsensusAccountDetailsPage/ConsensusAccountTransactionsCard'
import { RoflAppsPage } from './app/pages/RoflAppsPage'
import { RoflAppDetailsPage } from 'app/pages/RoflAppDetailsPage'
import { FC, useEffect } from 'react'
import { AnalyticsConsentProvider } from './app/components/AnalyticsConsent'
import { HighlightingContextProvider } from './app/components/HighlightingContext'
import { useLocalSettings } from './app/hooks/useLocalSettings'
import { InstancesCard } from './app/pages/RoflAppDetailsPage/InstancesCard'
import { useRoflAppDetailsProps } from './app/pages/RoflAppDetailsPage/hooks'
import { RoflAppUpdatesCard } from './app/pages/RoflAppDetailsPage/RoflAppUpdatesCard'
import { RoflAppInstanceTransactionsCard } from 'app/pages/RoflAppDetailsPage/RoflAppInstanceTransactionsCard'
import { RoflAppInstanceDetailsPage } from 'app/pages/RoflAppInstanceDetailsPage'
import { useRoflAppInstanceDetailsProps } from 'app/pages/RoflAppInstanceDetailsPage/hooks'
import { RoflAppInstanceRakTransactionsCard } from 'app/pages/RoflAppInstanceDetailsPage/RoflAppInstanceRakTransactionsCard'

const ScopeSpecificPart = () => {
  const { network, layer } = useRequiredScopeParam()
  return (
    <ThemeByScope isRootTheme={true} network={network} layer={layer}>
      <Outlet />
    </ThemeByScope>
  )
}

/**
 * In case of being restricted to a specific layer or layers, jump to a dashboard
 *
 * This should be rendered on the landing page, since we don't want the opening graph.
 */
const RedirectToDashboard: FC = () => {
  const navigate = useNavigate()
  const {
    settings: { preferredScope },
  } = useLocalSettings()

  const getPreferredScope = () =>
    !preferredScope
      ? undefined
      : RouteUtils.getEnabledScopes().find(
          scope => scope.network === preferredScope.network && scope.layer === preferredScope.layer,
        )

  const getDefaultScope = (): SearchScope => ({
    network:
      (fixedNetwork ?? fixedLayer)
        ? RouteUtils.getEnabledNetworksForLayer(fixedLayer)[0]!
        : RouteUtils.getEnabledScopes()[0].network,
    layer: fixedLayer ?? RouteUtils.getEnabledScopes()[0].layer,
  })

  useEffect(() => navigate(RouteUtils.getDashboardRoute(getPreferredScope() ?? getDefaultScope())))
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
        <HighlightingContextProvider>
          <Outlet />
        </HighlightingContextProvider>
      </AnalyticsConsentProvider>
    ),
    children: [
      { path: '/', element: skipGraph ? <RedirectToDashboard /> : withDefaultTheme(<HomePage />, true) },
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
        element: <ScopeSpecificPart />,
        errorElement: <RoutingErrorPage />,
        loader: async ({ params }): Promise<SearchScope> => {
          return assertEnabledScope({ network: params._network, layer: Layer.consensus })
        },
        id: 'consensusScope',
        children: [
          { path: '', element: <ConsensusDashboardPage /> },
          { path: `address`, element: <ConsensusAccountsPage /> },
          {
            path: `address/:address`,
            element: <ConsensusAccountDetailsPage />,
            loader: consensusAddressParamLoader(),
            children: [
              {
                path: '',
                Component: () => <ConsensusAccountTransactionsCard {...useConsensusAccountDetailsProps()} />,
              },
              {
                path: 'events',
                Component: () => <ConsensusAccountEventsCard {...useConsensusAccountDetailsProps()} />,
              },
            ],
          },
          { path: `proposal`, element: <ProposalsPage /> },
          { path: `proposal/:proposalId`, element: <ProposalDetailsPage />, loader: proposalIdParamLoader },
          { path: `validators`, element: <ValidatorsPage /> },
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
                path: 'events',
                Component: () => <ConsensusAccountEventsCard {...useValidatorDetailsProps()} />,
              },
              { path: 'delegators', Component: () => <DelegatorsCard {...useValidatorDetailsProps()} /> },
              {
                path: 'debonding-delegations',
                Component: () => <DebondingDelegationsCard {...useValidatorDetailsProps()} />,
              },
            ],
          },
          { path: `block`, element: <ConsensusBlocksPage /> },
          {
            path: `block/:blockHeight`,
            element: <ConsensusBlockDetailPage />,
            loader: blockHeightParamLoader,
            children: [
              {
                path: '',
                Component: () => <ConsensusBlockTransactionsCard {...useConsensusBlockDetailsProps()} />,
              },
              {
                path: 'events',
                Component: () => <ConsensusBlockEventsCard {...useConsensusBlockDetailsProps()} />,
              },
            ],
          },
          { path: 'tx', element: <ConsensusTransactionsPage /> },
          {
            path: `tx/:hash`,
            element: <ConsensusTransactionDetailPage />,
            loader: consensusTransactionParamLoader,
          },
        ],
      },
      {
        path: '/:_network/:_layer',
        element: <ScopeSpecificPart />,
        errorElement: <RoutingErrorPage />,
        loader: async ({ params }): Promise<SearchScope> => {
          return assertEnabledScope({ network: params._network, layer: params._layer })
        },
        id: 'runtimeScope',
        children: [
          { path: '', element: <ParatimeDashboardPage /> },
          {
            path: 'search', // Search within this scope
            element: <SearchResultsPage />,
          },

          { path: `block`, element: <RuntimeBlocksPage /> },
          {
            path: `block/:blockHeight`,
            element: <RuntimeBlockDetailPage />,
            loader: blockHeightParamLoader,
            children: [
              {
                path: '',
                Component: () => <RuntimeBlockTransactionsCard {...useRuntimeBlockDetailsProps()} />,
              },
              {
                path: 'events',
                Component: () => <RuntimeBlockEventsCard {...useRuntimeBlockDetailsProps()} />,
              },
            ],
          },
          {
            path: `address/:address`,
            element: <RuntimeAccountDetailsPage />,
            loader: runtimeAddressParamLoader(),
            children: [
              { path: '', Component: () => <AccountTransactionsCard {...useRuntimeAccountDetailsProps()} /> },
              { path: 'events', Component: () => <AccountEventsCard {...useRuntimeAccountDetailsProps()} /> },
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
              { path: 'code', Component: () => <ContractCodeCard {...useRuntimeAccountDetailsProps()} /> },
            ],
          },
          { path: `tx`, element: <RuntimeTransactionsPage /> },
          {
            path: `tx/:hash`,
            element: <RuntimeTransactionDetailPage />,
            loader: runtimeTransactionParamLoader,
          },
          { path: `token`, element: <TokensPage /> },
          {
            path: 'token/:address/instance/:instanceId',
            element: <NFTInstanceDashboardPage />,
            loader: runtimeAddressParamLoader(),
            children: [
              { path: '', Component: () => <NFTTokenTransfersCard {...useNftDetailsProps()} /> },
              { path: 'metadata', Component: () => <NFTMetadataCard {...useNftDetailsProps()} /> },
            ],
          },
          {
            path: `token/:address`,
            element: <TokenDashboardPage />,
            loader: runtimeAddressParamLoader(),
            children: [
              { path: '', Component: () => <TokenTransfersCard {...useTokenDashboardProps()} /> },
              { path: 'holders', Component: () => <TokenHoldersCard {...useTokenDashboardProps()} /> },
              { path: 'inventory', Component: () => <TokenInventoryCard {...useTokenDashboardProps()} /> },
              { path: 'code', Component: () => <ContractCodeCard {...useTokenDashboardProps()} /> },
            ],
          },
          {
            path: `rofl/app`,
            element: <RoflAppsPage />,
          },
          {
            path: `rofl/app/:id`,
            element: <RoflAppDetailsPage />,
            loader: roflAppParamLoader(),
            children: [
              {
                path: '',
                Component: () => <RoflAppInstanceTransactionsCard {...useRoflAppDetailsProps()} />,
              },
              {
                path: 'updates',
                Component: () => <RoflAppUpdatesCard {...useRoflAppDetailsProps()} />,
              },
              {
                path: 'instances',
                Component: () => <InstancesCard {...useRoflAppDetailsProps()} />,
              },
            ],
          },
          {
            path: `rofl/app/:id/instance/:rak`,
            element: <RoflAppInstanceDetailsPage />,
            loader: roflAppParamLoader(),
            children: [
              {
                path: '',
                Component: () => <RoflAppInstanceRakTransactionsCard {...useRoflAppInstanceDetailsProps()} />,
              },
            ],
          },
        ],
      },
    ],
  },
]
