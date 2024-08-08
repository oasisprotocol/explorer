import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { register as registerSwiperElements } from 'swiper/element/bundle'
import { routes } from './routes'
import './styles/index.css'
// Initialize languages
import './locales/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      useErrorBoundary: (error: any) => {
        // Automatically throw on 5xx errors. Components that want to handle
        // errors should set `useErrorBoundary: false` in their queries.
        return error.response?.status >= 500
      },
    },
  },
})

registerSwiperElements()

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
