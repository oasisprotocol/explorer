import { RouteObject } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'

import { BlocksPage } from './app/pages/BlocksPage'
import { TransactionsPage } from './app/pages/TransactionsPage'
import { DashboardPage } from './app/pages/DashboardPage'
import { BlockDetailPage } from './app/pages/BlockDetailPage'
import { AccountDetailsPage } from './app/pages/AccountDetailsPage'

export const emeraldRoute = '/emerald'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: emeraldRoute,
    element: <DashboardPage />,
  },
  {
    path: `${emeraldRoute}/blocks`,
    element: <BlocksPage />,
  },
  {
    path: `${emeraldRoute}/blocks/:blockHeight`,
    element: <BlockDetailPage />,
  },
  {
    path: `${emeraldRoute}/account/:address`,
    element: <AccountDetailsPage />,
  },
  {
    path: `${emeraldRoute}/transactions`,
    element: <TransactionsPage />,
  },
]
