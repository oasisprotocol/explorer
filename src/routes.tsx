import { RouteObject } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { BlocksPage } from './app/pages/BlocksPage'
import { TransactionsPage } from './app/pages/TransactionsPage'
import { DashboardPage } from './app/pages/DashboardPage'
import { BlockDetailPage } from './app/pages/BlockDetailPage'
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
      },
      {
        path: `/${paraTime}/transactions`,
        element: <TransactionsPage />,
      },
    ])
    .flat(),
  {
    path: `/blocks/:blockHeight`,
    element: <BlockDetailPage />,
  },
]
