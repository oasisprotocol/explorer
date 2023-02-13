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
  RouteUtils,
  addressParamLoader,
  blockHeightParamLoader,
  transactionParamLoader,
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
      ...RouteUtils.getEnabledParaTimes()
        .map(paraTime => [
          {
            path: `/${paraTime}`,
            element: <DashboardPage />,
          },
          {
            path: `/${paraTime}/blocks`,
            element: <BlocksPage />,
          },
          {
            path: `/${paraTime}/blocks/:blockHeight`,
            element: <BlockDetailPage />,
            loader: blockHeightParamLoader,
          },
          {
            path: `${paraTime}/account/:address`,
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
            path: `/${paraTime}/transactions`,
            element: <TransactionsPage />,
          },
          {
            path: `${paraTime}/transactions/:hash`,
            element: <TransactionDetailPage />,
            loader: transactionParamLoader,
          },
        ])
        .flat(),
      {
        path: `/blocks/:blockHeight`,
        element: <BlockDetailPage />,
      },
    ],
  },
]
