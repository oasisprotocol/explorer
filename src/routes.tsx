import { Outlet, RouteObject } from 'react-router-dom'
import { ThemedHomePage } from './app/pages/HomePage'
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
  layerLoader,
  networkLoader,
} from './app/utils/route-utils'
import { searchParamLoader } from './app/components/Search/search-utils'
import { RoutingErrorPage } from './app/pages/RoutingErrorPage'
import { NetworkThemeBubble } from './app/components/NetworkThemeBubble'
import { useNetworkParam } from './app/hooks/useNetworkParam'
import CssBaseline from '@mui/material/CssBaseline'

const NetworkSpecificPart = () => (
  <NetworkThemeBubble network={useNetworkParam()}>
    <CssBaseline />
    <Outlet />
  </NetworkThemeBubble>
)

export const routes: RouteObject[] = [
  {
    errorElement: <RoutingErrorPage />,
    children: [
      {
        path: '/',
        element: <ThemedHomePage />,
      },
      {
        path: '/:network', // ?q=
        element: <NetworkSpecificPart />,
        loader: networkLoader,
        children: [
          {
            path: 'search', // ?q=
            element: <SearchResultsPage />,
            loader: searchParamLoader,
          },
          {
            path: `:layer`,
            loader: layerLoader,
            errorElement: <RoutingErrorPage />,
            children: [
              {
                path: '',
                element: <DashboardPage />,
              },
              {
                path: `blocks`,
                element: <BlocksPage />,
              },
              {
                path: `blocks/:blockHeight`,
                element: <BlockDetailPage />,
                loader: blockHeightParamLoader,
              },
              {
                path: `account/:address`,
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
                  {
                    path: 'tokens/erc-721',
                    element: <TokensCard type="ERC721" />,
                    loader: addressParamLoader,
                  },
                ],
              },
              {
                path: `transactions`,
                element: <TransactionsPage />,
              },
              {
                path: `transactions/:hash`,
                element: <TransactionDetailPage />,
                loader: transactionParamLoader,
              },
            ],
          },
        ],
      },
    ],
  },
]
