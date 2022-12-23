import { RouteObject } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'

import { BlocksPage } from './app/pages/BlocksPage'
import { TransactionsPage } from './app/pages/TransactionsPage'
import { DashboardPage } from './app/pages/DashboardPage'

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
    path: `${emeraldRoute}/transactions`,
    element: <TransactionsPage />,
  },
]
