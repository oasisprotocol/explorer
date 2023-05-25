import { Network } from '../types/network'
import { AxiosRequestConfig } from 'axios'
import { QueryKey, UseQueryOptions } from '@tanstack/react-query'

export function wrapWithNetwork<P extends Array<any>, Q>(
  f: (...args: P) => Q,
): (net: Network, ...args: P) => Q {
  return (net, ...args) => {
    console.log('Should use', net)
    return f(...args)
  }
}

const baseUrlOverrides: Record<Network, string> = {
  mainnet: process.env.REACT_APP_API!, // This is just here for the sake of completeness, since the default URL is already specified for Axios elsewhere.
  testnet: process.env.REACT_APP_TESTNET_API!,
}

Object.keys(baseUrlOverrides).forEach(net => {
  const url = baseUrlOverrides[net as Network]
  if (!url) {
    console.warn(
      `URL for ${net} is not specified in config! Data from this network won't ba available. (See env.REACT_APP_*)`,
    )
  }
})

const getBaseUrlParamFor = (network: Network): Partial<AxiosRequestConfig<any>> => {
  const override = baseUrlOverrides[network]
  return override
    ? { baseURL: override }
    : {
        // No override means that the default one (already specified for Axios) will suffice.
      }
}

interface HasAxiosOptions {
  axios?: AxiosRequestConfig
}

export const getAxiosOptionsFor = (
  options: HasAxiosOptions = {},
  network: Network,
  moreOptions: Omit<AxiosRequestConfig, 'baseURL'> = {},
): HasAxiosOptions => ({
  axios: {
    ...options.axios,
    ...getBaseUrlParamFor(network),
    ...moreOptions,
  },
})

interface HasQueryOptions<A, B, C> {
  query?: UseQueryOptions<A, B, C>
}

/**
 * Helper function for adding query options for query key override and base URL override
 * @param options
 * @param network
 * @param keyElements
 * @param moreOptions
 */
export function getOptionsFor<A, B, C>(
  options: (HasQueryOptions<A, B, C> & HasAxiosOptions) | undefined,
  network: Network,
  keyElements: QueryKey = [],
  moreOptions: Omit<AxiosRequestConfig, 'baseURL'> = {},
): HasQueryOptions<A, B, C> & HasAxiosOptions {
  return {
    ...options,
    query: {
      ...options?.query,
      queryKey: [network, ...keyElements],
    },
    axios: {
      ...options?.axios,
      ...getBaseUrlParamFor(network),
      ...moreOptions,
    },
  }
}
