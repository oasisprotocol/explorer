import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from './routes'

Axios.defaults.baseURL = process.env.REACT_APP_API
const queryClient = new QueryClient({})

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
