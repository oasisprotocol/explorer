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
import { LocalSettingsContextProvider } from './app/providers/LocalSettingsProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      useErrorBoundary: (error: any) => {
        // Automatically throw on 5xx errors. Components that want to handle
        // errors should set `useErrorBoundary: false` in their queries.
        if (error.response?.status >= 500) return true

        // https://nexus.oasis.io/v1/sapphire/events?offset=0&limit=10&type=evm.log&evm_log_signature=ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&rel=oasis1qpdgv5nv2dhxp4q897cgag6kgnm9qs0dccwnckuu
        // threw 524 error after 100 seconds but didn't return status code to javascript. It's because Nexus didn't
        // respond quickly enough, so Cloudflare canceled with timeout, but Cloudflare doesn't add Nexus' CORS headers.
        if (!error.response && error.code === 'ERR_NETWORK') return true

        return false
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
      <LocalSettingsContextProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </LocalSettingsContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
