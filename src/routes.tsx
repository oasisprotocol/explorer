import { Outlet, RouteObject, ScrollRestoration } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { BlocksPage } from './app/pages/BlocksPage'
import { TransactionsPage } from './app/pages/TransactionsPage'
import { TransactionDetailPage } from './app/pages/TransactionDetailPage'
import { DashboardPage } from './app/pages/DashboardPage'
import { BlockDetailPage } from './app/pages/BlockDetailPage'
import { AccountDetailsPage } from './app/pages/AccountDetailsPage'
import { TransactionsCard } from './app/pages/AccountDetailsPage/TransactionsCard'
import { TokensCard } from './app/pages/AccountDetailsPage/TokensCard'
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
import { TokensPage } from './app/pages/TokensPage'

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
            element: <DashboardPage />,
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
                element: <TransactionsCard />,
                loader: addressParamLoader,
              },
              {
                path: 'tokens/erc-20',
                element: <TokensCard type="ERC20" />,
                loader: addressParamLoader,
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
            path: `token/:address`, // This is a temporal workaround, until we have the required dedicated functionality for tokens
            element: <AccountDetailsPage />,
            loader: addressParamLoader,
            children: [
              {
                path: '',
                element: <TransactionsCard />,
                loader: addressParamLoader,
              },
              {
                path: 'tokens/erc-20',
                element: <TokensCard type="ERC20" />,
                loader: addressParamLoader,
              },
            ],
          },
        ],
      },
    ],
  },
]
