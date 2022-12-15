import { RouteObject } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { PageLayout } from './app/components/PageLayout'
import { BlocksPage } from './app/pages/BlocksPage'
import { DashboardPage } from './app/pages/DashboardPage'

export type NetworkParams = {
  network: string
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: ':network', // how we finally call consensus and paratimes in general?
    element: <PageLayout />,
    children: [
      {
        path: 'blocks',
        element: <BlocksPage />,
      },
      {
        path: '',
        element: <DashboardPage />,
      },
    ],
  },
]
