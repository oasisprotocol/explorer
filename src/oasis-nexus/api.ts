/** @file Wrappers around generated API */

import axios, { AxiosResponse } from 'axios'
import { paraTimesConfig } from '../config'
import * as generated from './generated/api'
import { UseQueryOptions } from '@tanstack/react-query'
import { EvmToken, Layer, RuntimeAccount } from './generated/api'
import { fromBaseUnits, getEthAccountAddressFromPreimage } from '../app/utils/helpers'
import { Network } from '../types/network'
import { SearchScope } from '../types/searchScope'
import { getTickerForNetwork, NativeTicker } from '../types/ticker'

export * from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

export type HasScope = SearchScope

declare module './generated/api' {
  export interface Transaction {
    network: Network
    layer: Layer
    ticker: NativeTicker
  }
  export interface RuntimeTransaction {
    network: Network
    layer: Layer
    ticker: NativeTicker
  }
  export interface Block {
    network: Network
    layer: Layer
  }
  export interface RuntimeBlock {
    network: Network
    layer: Layer
  }
  export interface Account {
    network: Network
    layer: Layer
    ticker: NativeTicker
  }
  export interface RuntimeAccount {
    network: Network
    layer: Layer
    address_eth?: string
    ticker: NativeTicker
    tokenBalances: Partial<Record<EvmTokenType, generated.RuntimeEvmBalance[]>>
  }
  export interface RuntimeEvent {
    network: Network
    layer: Layer
  }

  export interface EvmToken {
    network: Network
    layer: Layer
  }
  export interface BareTokenHolder {
    network: Network
    layer: Layer
    rank: number
  }
}

export const isAccountEmpty = (account: RuntimeAccount) => {
  const { balances, evm_balances, stats } = account
  const { total_received, total_sent, num_txns } = stats
  const result =
    !balances?.length && !evm_balances?.length && total_received === '0' && total_sent === '0' && !num_txns
  return result
}

export const isAccountNonEmpty = (account: RuntimeAccount) => !isAccountEmpty(account)

export const groupAccountTokenBalances = (account: Omit<RuntimeAccount, 'tokenBalances'>): RuntimeAccount => {
  const tokenBalances: Partial<Record<generated.EvmTokenType, generated.RuntimeEvmBalance[]>> = {}
  account.evm_balances.forEach(balance => {
    if (balance.token_type) {
      tokenBalances[balance.token_type] ??= []
      tokenBalances[balance.token_type]!.push(balance)
    }
  })

  return {
    ...account,
    tokenBalances,
  }
}

function arrayify<T>(arrayOrItem: null | undefined | T | T[]): T[] {
  if (arrayOrItem == null) return []
  if (!Array.isArray(arrayOrItem)) return [arrayOrItem]
  return arrayOrItem
}

export const useGetConsensusTransactions: typeof generated.useGetConsensusTransactions = (
  network,
  params?,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetConsensusTransactions(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.TransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                network,
                layer: Layer.consensus,
                ticker,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

const adjustRuntimeTransactionMethod = (
  method: string | undefined,
  isLikelyNativeTokenTransfer: boolean | undefined,
) => (isLikelyNativeTokenTransfer ? 'accounts.Transfer' : method)

export const useGetRuntimeTransactions: typeof generated.useGetRuntimeTransactions = (
  network,
  runtime,
  params?,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetRuntimeTransactions(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                eth_hash: tx.eth_hash ? `0x${tx.eth_hash}` : undefined,
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
                layer: runtime,
                network,
                ticker,
                method: adjustRuntimeTransactionMethod(tx.method, tx.is_likely_native_token_transfer),
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusTransactionsTxHash: typeof generated.useGetConsensusTransactionsTxHash = (
  network,
  txHash,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetConsensusTransactionsTxHash(network, txHash, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.TransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                layer: Layer.consensus,
                network,
                ticker,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeTransactionsTxHash: typeof generated.useGetRuntimeTransactionsTxHash = (
  network,
  runtime,
  txHash,
  options?,
) => {
  // Sometimes we will call this with an undefined txHash, so we must be careful here.
  const actualHash = txHash?.startsWith('0x') ? txHash.substring(2) : txHash
  const ticker = getTickerForNetwork(network)
  return generated.useGetRuntimeTransactionsTxHash(network, runtime, actualHash, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeTransactionList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            transactions: data.transactions.map(tx => {
              return {
                ...tx,
                eth_hash: tx.eth_hash ? `0x${tx.eth_hash}` : undefined,
                fee: tx.fee ? fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals) : undefined,
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
                layer: runtime,
                network,
                ticker,
                method: adjustRuntimeTransactionMethod(tx.method, tx.is_likely_native_token_transfer),
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusAccountsAddress: typeof generated.useGetConsensusAccountsAddress = (
  network,
  address,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetConsensusAccountsAddress(network, address, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Account, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            layer: Layer.consensus,
            network,
            ticker,
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeAccountsAddress: typeof generated.useGetRuntimeAccountsAddress = (
  network,
  runtime,
  address,
  options?,
) => {
  const ticker = getTickerForNetwork(network)
  return generated.useGetRuntimeAccountsAddress(network, runtime, address, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount, headers, status) => {
          if (status !== 200) return data
          return groupAccountTokenBalances({
            ...data,
            address_eth: getEthAccountAddressFromPreimage(data.address_preimage),
            evm_contract: data.evm_contract && {
              ...data.evm_contract,
              eth_creation_tx: data.evm_contract.eth_creation_tx
                ? `0x${data.evm_contract.eth_creation_tx}`
                : undefined,
            },
            evm_balances: (data.evm_balances || [])
              .filter(token => token.balance) // TODO: why do we filter for this? According to the API it must be there
              .map(token => {
                return {
                  ...token,
                  balance: fromBaseUnits(token.balance, token.token_decimals),
                }
              }),
            balances: (data.balances || [])
              .filter(token => token.balance) // TODO: why do we filter for this? According to the API it must be there
              .map(token => {
                return {
                  ...token,
                  balance: fromBaseUnits(token.balance, token.token_decimals),
                }
              }),
            layer: runtime,
            network,
            stats: {
              ...data.stats,
              total_received: data.stats?.total_received
                ? fromBaseUnits(data.stats?.total_received, paraTimesConfig[runtime].decimals)
                : '0',
              total_sent: data.stats?.total_sent
                ? fromBaseUnits(data.stats?.total_sent, paraTimesConfig[runtime].decimals)
                : '0',
            },
            ticker,
          })
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export function useGetConsensusBlockByHeight(
  network: Network,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const result = generated.useGetConsensusBlocksHeight<AxiosResponse<generated.Block, any>>(
    network,
    blockHeight,
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (block: generated.Block, headers, status) => {
            if (status !== 200) return block
            return {
              ...block,
              layer: Layer.consensus,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

// TODO: replace with an appropriate API
export function useGetRuntimeBlockByHeight(
  network: Network,
  runtime: generated.Runtime,
  blockHeight: number,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const params: generated.GetRuntimeBlocksParams = { to: blockHeight, limit: 1 }
  const result = generated.useGetRuntimeBlocks<AxiosResponse<generated.RuntimeBlock, any>>(
    network,
    runtime,
    params,
    {
      ...options,
      request: {
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          function (data: generated.RuntimeBlockList, headers, status) {
            if (status !== 200) return data
            const block = data.blocks[0]
            if (!block || block.round !== blockHeight) {
              throw new axios.AxiosError('not found', 'ERR_BAD_REQUEST', this, null, {
                status: 404,
                statusText: 'not found',
                config: this,
                data: 'not found',
                headers: {},
              })
            }
            return {
              ...block,
              layer: runtime,
              network,
            }
          },
        ],
      },
    },
  )
  return result
}

export const useGetConsensusBlocks: typeof generated.useGetConsensusBlocks = (network, params, options) => {
  return generated.useGetConsensusBlocks(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.BlockList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            blocks: data.blocks.map(block => {
              return {
                ...block,
                layer: Layer.consensus,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeBlocks: typeof generated.useGetRuntimeBlocks = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeBlocks(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeBlockList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            blocks: data.blocks.map(block => {
              return {
                ...block,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokens: typeof generated.useGetRuntimeEvmTokens = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeEvmTokens(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.EvmTokenList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            evm_tokens: data.evm_tokens.map(token => {
              return {
                ...token,
                total_supply: token.total_supply
                  ? fromBaseUnits(token.total_supply, token.decimals || 0)
                  : undefined,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokensAddress: typeof generated.useGetRuntimeEvmTokensAddress = (
  network,
  runtime,
  address,
  options,
) => {
  return generated.useGetRuntimeEvmTokensAddress(network, runtime, address, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: EvmToken, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            total_supply: data.total_supply
              ? fromBaseUnits(data.total_supply, data.decimals || 0)
              : undefined,
            network,
            layer: runtime,
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvents: typeof generated.useGetRuntimeEvents = (
  network,
  runtime,
  params,
  options,
) => {
  return generated.useGetRuntimeEvents(network, runtime, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeEventList, headers, status) => {
          // Parts of
          // https://index.oasislabs.com/v1/emerald/events?tx_hash=3d16c34f45ea746a28f677dfeb5763cf930f003e513d2b6f91f87e6355a63c52&limit=100
          // https://index-staging.oasislabs.com/v1/emerald/events?tx_hash=8fd925514dd66f7cb70211b09f887883849bdadb54be079370d391dfc4b045b6&limit=100
          // https://index.oasislabs.com/v1/emerald/events?limit=1&offset=0&type=accounts.transfer
          // https://index.oasislabs.com/v1/emerald/events?limit=1&offset=0&type=accounts.mint
          // https://index.oasislabs.com/v1/emerald/events?limit=1&offset=0&type=accounts.burn
          // https://index.oasislabs.com/v1/emerald/events?limit=1&offset=0&type=consensus_accounts.deposit
          // https://index.oasislabs.com/v1/emerald/events?limit=1&offset=0&type=consensus_accounts.withdraw
          // custom mint and burn
          // https://index.oasislabs.com/v1/emerald/events?tx_hash=22932a60a8d05259f75c0e093bb6772ffe20c6036de5477d1006f58e26ef77c0&limit=100
          data = {
            events: [
              {
                body: {
                  amount: 195364,
                },
                eth_tx_hash: '16931dc7ee192ce76ba4cf8c92bc08cfd384b3b96b0db8fa77c573a9a31db9fc',
                evm_log_name: '',
                round: 4172585,
                tx_hash: '3d16c34f45ea746a28f677dfeb5763cf930f003e513d2b6f91f87e6355a63c52',
                tx_index: 0,
                type: 'core.gas_used',
              },
              {
                body: {
                  address: 'KMnT5om102Ka/C1p72onmVeFdOA=',
                  data: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFOkgr0Y8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACo88fwEuFdOIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
                  topics: [
                    '14rZX6RsmUtlUdDahfwnX+YTzjdlf7jV49EwhAFZ2CI=',
                    'AAAAAAAAAAAAAAAAfZOVwJqysax0FxWNV7RHIuLm8Sw=',
                    'AAAAAAAAAAAAAAAAfZOVwJqysax0FxWNV7RHIuLm8Sw=',
                  ],
                },
                eth_tx_hash: '16931dc7ee192ce76ba4cf8c92bc08cfd384b3b96b0db8fa77c573a9a31db9fc',
                evm_log_name: '',
                round: 4172585,
                tx_hash: '3d16c34f45ea746a28f677dfeb5763cf930f003e513d2b6f91f87e6355a63c52',
                tx_index: 0,
                type: 'evm.log',
              },
              {
                body: {
                  address: 'YTG1+uGepPnZZOrAQI5ECLZjN7U=',
                  data: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8XsiU291cmNlIjoiIiwiQW1vdW50SW5VU0QiOiIyMy4yMjgyNDE5NDM2MDg4MzYiLCJBbW91bnRPdXRVU0QiOiIxNzAuNzYzNDk2ODE4MDI0MjQiLCJSZWZlcnJhbCI6IiIsIkZsYWdzIjowLCJJbnRlZ3JpdHlJbmZvIjp7IktleUlEIjoiMSIsIlNpZ25hdHVyZSI6IlpDZ2RWQVNkNW8yOVZNRUEvbEZZZzJ6WTBuK0c3V0Rsck1HRnRlRlZDQyt2K3RhTm9YT3F3Nm9aZkVFQ2RZanNQcG5CeFBHVjF5cjEyNGloSHRnVENHMGQwcXk1KytoU2toT0hOTVpJOWwwL3Y0TXRQcGw0R3poTU95SGE4dXdhZkttTEtYcFRGZ1JOeU5ycFlTVVU2Y0N2MVBpaktxV3I5bFJjTmZES1BiOUNyZDZqSk0wOE5nMzFJRFppWnpmOGVBWlZkRklNQm9SUFY5OERqNURlNEJ1NTg1M055dEdNSVlqV1dxRktmTVVvUHdLUzFlVkZHd1Y0TDRERHFsQm5BR3V6c2FmVGJZNVNRdVVnZ1BrNXZrSFZvL3pqUk1SRm82KzVsanRrbExTcklZWUl5T1I0dFI1elZUczR6cFU4MlRTOXZGdEllbGF5bzE5eGhBdTY2Zz09In19AAAAAAAAAAAAAAAAAAAA',
                  topics: ['CV5m+k3Wpve0P7hESnvQ7bhwUIx6v2ObwhbvsLz/l3k='],
                },
                eth_tx_hash: '1041d398e89e1ef9b6f89973aed56436b675d25b6804f1dc8d971ee0cd600944',
                evm_log_name: '',
                round: 4172573,
                tx_hash: '8fd925514dd66f7cb70211b09f887883849bdadb54be079370d391dfc4b045b6',
                tx_index: 1,
                type: 'evm.log',
              },
              {
                body: {
                  address: 'MiPxeVe6UCy+cUAdVaDbJuX3xo8=',
                  data: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTpIK9GPCA=',
                  topics: [
                    '3fJSrRviyJtpwrBo/DeNqpUrp/FjxKEWKPVaTfUjs+8=',
                    'AAAAAAAAAAAAAAAAfZOVwJqysax0FxWNV7RHIuLm8Sw=',
                    'AAAAAAAAAAAAAAAAKMnT5om102Ka/C1p72onmVeFdOA=',
                  ],
                },
                eth_tx_hash: '16931dc7ee192ce76ba4cf8c92bc08cfd384b3b96b0db8fa77c573a9a31db9fc',
                evm_log_name: 'Transfer',
                evm_log_params: [
                  {
                    evm_type: 'address',
                    name: 'from',
                    value: '0x7d9395c09ab2b1ac7417158d57b44722e2e6f12c',
                  },
                  {
                    evm_type: 'address',
                    name: 'to',
                    value: '0x28c9d3e689b5d3629afc2d69ef6a2799578574e0',
                  },
                  {
                    evm_type: 'uint256',
                    name: 'value',
                    value: '5885826123054112',
                  },
                ],
                round: 4172585,
                tx_hash: '3d16c34f45ea746a28f677dfeb5763cf930f003e513d2b6f91f87e6355a63c52',
                tx_index: 0,
                type: 'evm.log',
              },
              {
                body: {
                  amount: { Amount: '100000000000000000', Denomination: '' },
                  from: 'oasis1qqn5lhdlq7t730qyrsxj4ph4a8xnhwjtcs87fmrd',
                  to: 'oasis1qr677rv0dcnh7ys4yanlynysvnjtk9gnsyhvm6ln',
                },
                evm_log_name: '',
                round: 4172571,
                tx_hash: '800651c7af2f5f14539c57d745fe9775ba889154eb1f9c775bff0c47c9ff9c3d',
                tx_index: 0,
                type: 'accounts.transfer',
              },
              {
                body: {
                  amount: { Amount: '100000000000000000', Denomination: '' },
                  owner: 'oasis1qqn5lhdlq7t730qyrsxj4ph4a8xnhwjtcs87fmrd',
                },
                evm_log_name: '',
                round: 4172585,
                tx_hash: null,
                type: 'accounts.mint',
              },
              {
                body: {
                  amount: { Amount: '100000000000000000', Denomination: '' },
                  owner: 'oasis1qr677rv0dcnh7ys4yanlynysvnjtk9gnsyhvm6ln',
                },
                evm_log_name: '',
                round: 4172572,
                tx_hash: null,
                type: 'accounts.burn',
              },
              {
                body: {
                  amount: { Amount: '100000000000000000', Denomination: '' },
                  from: 'oasis1qzypxmt5xg8039329zvre7hxe7kn0vxfugsknqtw',
                  nonce: 14178,
                  to: 'oasis1qqn5lhdlq7t730qyrsxj4ph4a8xnhwjtcs87fmrd',
                },
                evm_log_name: '',
                round: 4172585,
                tx_hash: null,
                type: 'consensus_accounts.deposit',
              },
              {
                body: {
                  amount: { Amount: '100000000000000000', Denomination: '' },
                  from: 'oasis1qqn5lhdlq7t730qyrsxj4ph4a8xnhwjtcs87fmrd',
                  nonce: 12796,
                  to: 'oasis1qzypxmt5xg8039329zvre7hxe7kn0vxfugsknqtw',
                },
                evm_log_name: '',
                round: 4172572,
                tx_hash: null,
                type: 'consensus_accounts.withdraw',
              },
              {
                body: {
                  address: 'MiPxeVe6UCy+cUAdVaDbJuX3xo8=',
                  data: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTpIK9GPCA=',
                  topics: [
                    '3fJSrRviyJtpwrBo/DeNqpUrp/FjxKEWKPVaTfUjs+8=',
                    'AAAAAAAAAAAAAAAAfZOVwJqysax0FxWNV7RHIuLm8Sw=',
                    'AAAAAAAAAAAAAAAAKMnT5om102Ka/C1p72onmVeFdOA=',
                  ],
                },
                eth_tx_hash: '16931dc7ee192ce76ba4cf8c92bc08cfd384b3b96b0db8fa77c573a9a31db9fc',
                evm_log_name: 'Transfer',
                evm_log_params: [
                  {
                    evm_type: 'address',
                    name: 'from',
                    value: '0x0000000000000000000000000000000000000000',
                  },
                  {
                    evm_type: 'address',
                    name: 'to',
                    value: '0x28c9d3e689b5d3629afc2d69ef6a2799578574e0',
                  },
                  {
                    evm_type: 'uint256',
                    name: 'value',
                    value: '5885826123054112',
                  },
                ],
                round: 4172585,
                tx_hash: '3d16c34f45ea746a28f677dfeb5763cf930f003e513d2b6f91f87e6355a63c52',
                tx_index: 0,
                type: 'evm.log',
              },
              {
                body: {
                  address: 'MiPxeVe6UCy+cUAdVaDbJuX3xo8=',
                  data: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTpIK9GPCA=',
                  topics: [
                    '3fJSrRviyJtpwrBo/DeNqpUrp/FjxKEWKPVaTfUjs+8=',
                    'AAAAAAAAAAAAAAAAfZOVwJqysax0FxWNV7RHIuLm8Sw=',
                    'AAAAAAAAAAAAAAAAKMnT5om102Ka/C1p72onmVeFdOA=',
                  ],
                },
                eth_tx_hash: '16931dc7ee192ce76ba4cf8c92bc08cfd384b3b96b0db8fa77c573a9a31db9fc',
                evm_log_name: 'Transfer',
                evm_log_params: [
                  {
                    evm_type: 'address',
                    name: 'from',
                    value: '0x7d9395c09ab2b1ac7417158d57b44722e2e6f12c',
                  },
                  {
                    evm_type: 'address',
                    name: 'to',
                    value: '0x0000000000000000000000000000000000000000',
                  },
                  {
                    evm_type: 'uint256',
                    name: 'value',
                    value: '5885826123054112',
                  },
                ],
                round: 4172585,
                tx_hash: '3d16c34f45ea746a28f677dfeb5763cf930f003e513d2b6f91f87e6355a63c52',
                tx_index: 0,
                type: 'evm.log',
              },
              {
                body: {
                  address: 'JzZkPH//4YaYT2Ci00uRsbc5i/E=',
                  data: 'AAAAAAAAAAAAAAAAAAAAAAAABO4tbUFbgo91OmtEoAA=',
                  topics: [
                    'jFvh5evsfVvRT3FCfR6E890DFMD3sikeWyAKyMfDuSU=',
                    'AAAAAAAAAAAAAAAAZ3BGa22gtECrA3g0uTmbx4FdXUI=',
                    'AAAAAAAAAAAAAAAAzvL5XxhdSbzRwQ3n8jvqy6rm7Q8=',
                  ],
                },
                eth_tx_hash: 'a71bd98b4739849dfed360f3fc9eb101f12fee08ed640fe54602e339a542dc75',
                evm_log_name: 'Approval',
                evm_log_params: [
                  {
                    evm_type: 'address',
                    name: 'owner',
                    value: '0x6770466b6da0b440ab037834b9399bc7815d5d42',
                  },
                  {
                    evm_type: 'address',
                    name: 'spender',
                    value: '0xcef2f95f185d49bcd1c10de7f23beacbaae6ed0f',
                  },
                  {
                    evm_type: 'uint256',
                    name: 'value',
                    value: '99999999999999775530000000000000',
                  },
                ],
                round: 454364,
                tx_hash: '22932a60a8d05259f75c0e093bb6772ffe20c6036de5477d1006f58e26ef77c0',
                tx_index: 0,
                type: 'evm.log',
              },
            ],
            is_total_count_clipped: false,
            total_count: 7,
          } as any
          if (status !== 200) return data
          return {
            ...data,
            events: data.events.map(event => {
              const adjustedHash = event.eth_tx_hash ? `0x${event.eth_tx_hash}` : undefined
              if (
                event.type === 'accounts.transfer' ||
                event.type === 'accounts.mint' ||
                event.type === 'accounts.burn' ||
                event.type === 'consensus_accounts.deposit' ||
                event.type === 'consensus_accounts.withdraw'
              ) {
                return {
                  ...event,
                  eth_tx_hash: adjustedHash,
                  body: {
                    ...event.body,
                    amount:
                      // If there's no denomination then use runtime's native. Otherwise unknown (would have to get by token name?).
                      event.body.amount.Denomination === ''
                        ? {
                            ...event.body.amount,
                            Amount: fromBaseUnits(
                              event.body.amount.Amount,
                              paraTimesConfig[runtime].decimals,
                            ),
                            Denomination: getTickerForNetwork(network),
                          }
                        : event.body.amount,
                  },
                  layer: runtime,
                  network,
                }
              }
              return {
                ...event,
                eth_tx_hash: adjustedHash,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetRuntimeEvmTokensAddressHolders: typeof generated.useGetRuntimeEvmTokensAddressHolders = (
  network,
  runtime,
  address,
  params,
  options,
) => {
  return generated.useGetRuntimeEvmTokensAddressHolders(network, runtime, address, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.TokenHolderList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            holders: data.holders.map((holder, index) => {
              return {
                ...holder,
                rank: index + (params?.offset ?? 0) + 1,
                layer: runtime,
                network,
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}
