import { Outlet, RouteObject, ScrollRestoration } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { BlocksPage } from './app/pages/BlocksPage'
import { TransactionsPage } from './app/pages/TransactionsPage'
import { TransactionDetailPage } from './app/pages/TransactionDetailPage'
import { ParatimeDashboardPage } from './app/pages/ParatimeDashboardPage'
import { BlockDetailPage } from './app/pages/BlockDetailPage'
import { AccountDetailsPage, useAccountDetailsProps } from './app/pages/AccountDetailsPage'
import { AccountTransactionsCard } from './app/pages/AccountDetailsPage/AccountTransactionsCard'
import { AccountTokensCard } from './app/pages/AccountDetailsPage/AccountTokensCard'
import { SearchResultsPage } from './app/pages/SearchResultsPage'
import {
  addressParamLoader,
  blockHeightParamLoader,
  transactionParamLoader,
  scopeLoader,
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

const NetworkSpecificPart = () => (
  <ThemeByNetwork network={useRequiredScopeParam().network}>
    <Outlet />
  </ThemeByNetwork>
)

export const routes: RouteObject[] = [
  {
    errorElement: withDefaultTheme(<RoutingErrorPage />),
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
        path: '/:network/:layer',
        element: <NetworkSpecificPart />,
        errorElement: withDefaultTheme(<RoutingErrorPage />),
        loader: scopeLoader,
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
            element: <BlocksPage />,
          },
          {
            path: `block/:blockHeight`,
            element: <BlockDetailPage />,
            loader: blockHeightParamLoader,
          },
          {
            path: `address/:address`,
            element: <AccountDetailsPage />,
            loader: addressParamLoader,
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
            element: <TransactionsPage />,
          },
          {
            path: `tx/:hash`,
            element: <TransactionDetailPage />,
            loader: transactionParamLoader,
          },
          {
            path: `token`,
            element: <TokensPage />,
          },
          {
            path: 'token/:address/instance/:instanceId',
            element: <NFTInstanceDashboardPage />,
            loader: addressParamLoader,
            children: [
              {
                path: '',
                Component: () => <NFTMetadataCard {...useNftDetailsProps()} />,
              },
            ],
          },
          {
            path: `token/:address`,
            element: <TokenDashboardPage />,
            loader: addressParamLoader,
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
