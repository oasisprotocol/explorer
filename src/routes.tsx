import { RouteObject } from 'react-router-dom'
import { HomePage } from './app/pages/HomePage'
import { BlocksPage } from './app/pages/BlocksPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage></HomePage>,
  },
  {
    path: '/blocks',
    element: <BlocksPage></BlocksPage>,
  },
]
