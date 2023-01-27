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
import { RouteUtils } from './app/utils/route-utils'

export const routes: RouteObject[] = [
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
      },
      {
        path: `${paraTime}/account/:address`,
        element: <AccountDetailsPage />,
        children: [
          {
            path: '',
            element: <TransactionsCard />,
          },
          {
            path: 'tokens/erc-20',
            element: <TokensCard type="ERC20" />,
          },
          {
            path: 'tokens/erc-721',
            element: <TokensCard type="ERC721" />,
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
      },
    ])
    .flat(),
  {
    path: `/blocks/:blockHeight`,
    element: <BlockDetailPage />,
  },
]
