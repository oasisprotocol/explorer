import { Outlet, RouteObject, ScrollRestoration } from 'react-router-dom'
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
  consensusAddressParamLoader,
  runtimeAddressParamLoader,
  blockHeightParamLoader,
  transactionParamLoader,
  assertEnabledScope,
  proposalIdParamLoader,
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
import { ConsensusAccountDetailsPage } from './app/pages/ConsensusAccountDetailsPage'

const NetworkSpecificPart = () => (
  <ThemeByNetwork network={useRequiredScopeParam().network}>
    <Outlet />
  </ThemeByNetwork>
)

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
      {
        path: '/',
        element: withDefaultTheme(<HomePage />),
      },
      {
        path: '/search', // Global search
        element: withDefaultTheme(<SearchResultsPage />),
        loader: searchParamLoader,
      },
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
            loader: runtimeAddressParamLoader(),
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
                    loader: runtimeAddressParamLoader('contractAddress'),
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
