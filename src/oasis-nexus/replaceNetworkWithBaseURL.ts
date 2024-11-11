import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export const replaceNetworkWithBaseURL = <T>(
  config: AxiosRequestConfig,
  requestOverrides?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  if (config.url?.startsWith('/mainnet/')) {
    config.url = config.url.replace('/mainnet/', process.env.REACT_APP_API!)
  } else if (config.url?.startsWith('/testnet/')) {
    config.url = config.url.replace('/testnet/', process.env.REACT_APP_TESTNET_API!)
  } else if (config.url?.startsWith('/localnet/')) {
    config.url = config.url.replace('/localnet/', process.env.REACT_APP_LOCALNET_API!)
  } else {
    throw new Error(`Expected URL to be prefixed with network: ${config.url}`)
  }

  return axios({ ...config, ...requestOverrides })
}

export default replaceNetworkWithBaseURL
