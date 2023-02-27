import { RouteObject } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { BlocksPage } from './app/pages/BlocksPage'
import { TransactionsPage } from './app/pages/TransactionsPage'
import { TransactionDetailPage } from './app/pages/TransactionDetailPage'
import { DashboardPage } from './app/pages/DashboardPage'
import { BlockDetailPage } from './app/pages/BlockDetailPage'
import { AccountDetailsPage } from './app/pages/AccountDetailsPage'
import { TransactionsCard } from './app/pages/AccountDetailsPage/TransactionsCard'
import { TokensCard } from './app/pages/AccountDetailsPage/TokensCard'
import {
  addressParamLoader,
  blockHeightParamLoader,
  transactionParamLoader,
  paraTimeLoader,
} from './app/utils/route-utils'
import { RoutingErrorPage } from './app/pages/RoutingErrorPage'

export const routes: RouteObject[] = [
  {
    errorElement: <RoutingErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: `/:paraTime`,
        element: <DashboardPage />,
        loader: paraTimeLoader,
      },
      {
        path: `/:paraTime/blocks`,
        element: <BlocksPage />,
        loader: paraTimeLoader,
      },
      {
        path: `/:paraTime/blocks/:blockHeight`,
        element: <BlockDetailPage />,
        loader: args => paraTimeLoader(args, blockHeightParamLoader),
      },
      {
        path: `/:paraTime/account/:address`,
        element: <AccountDetailsPage />,
        loader: args => paraTimeLoader(args, addressParamLoader),
        children: [
          {
            path: '',
            element: <TransactionsCard />,
            loader: args => paraTimeLoader(args, addressParamLoader),
          },
          {
            path: 'tokens/erc-20',
            element: <TokensCard type="ERC20" />,
            loader: args => paraTimeLoader(args, addressParamLoader),
          },
          {
            path: 'tokens/erc-721',
            element: <TokensCard type="ERC721" />,
            loader: args => paraTimeLoader(args, addressParamLoader),
          },
        ],
      },
      {
        path: `/:paraTime/transactions`,
        element: <TransactionsPage />,
        loader: paraTimeLoader,
      },
      {
        path: `/:paraTime/transactions/:hash`,
        element: <TransactionDetailPage />,
        loader: args => paraTimeLoader(args, transactionParamLoader),
      },
      {
        path: `/blocks/:blockHeight`,
        element: <BlockDetailPage />,
      },
    ],
  },
]
