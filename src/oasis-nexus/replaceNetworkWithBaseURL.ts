import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export const replaceNetworkWithBaseURL = <T>(
  config: AxiosRequestConfig,
  requestOverrides?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  if (config.url?.startsWith('/mainnet/')) {
    config.url = config.url.replace('/mainnet/', process.env.VITE_API!)
  } else if (config.url?.startsWith('/testnet/')) {
    config.url = config.url.replace('/testnet/', process.env.VITE_TESTNET_API!)
  } else {
    throw new Error(`Expected URL to be prefixed with network: ${config.url}`)
  }

  return axios({ ...config, ...requestOverrides })
}

export default replaceNetworkWithBaseURL
