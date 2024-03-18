/** @file Wrappers around generated API */

import axios, { AxiosResponse } from 'axios'
import { consensusDecimals, getTokensForScope, paraTimesConfig } from '../config'
import * as generated from './generated/api'
import { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import {
  EvmToken,
  EvmTokenType,
  GetRuntimeAccountsAddress,
  HumanReadableErrorResponse,
  Layer,
  NotFoundErrorResponse,
  RuntimeAccount,
  RuntimeEventType,
} from './generated/api'
import { fromBaseUnits, getEthAddressForAccount, getAccountSize } from '../app/utils/helpers'
import { Network } from '../types/network'
import { SearchScope } from '../types/searchScope'
import { Ticker } from '../types/ticker'
import { useTransformToOasisAddress } from '../app/hooks/useTransformToOasisAddress'
import { useEffect, useState } from 'react'
import { RpcUtils } from '../app/utils/rpc-utils'
import { toChecksumAddress } from '@ethereumjs/util'

export * from './generated/api'
export type { RuntimeEvmBalance as Token } from './generated/api'

export type HasScope = SearchScope

declare module './generated/api' {
  export interface Transaction {
    network: Network
    layer: Layer
    ticker: Ticker
  }

  export interface RuntimeTransaction {
    network: Network
    layer: Layer
    ticker: Ticker
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
    ticker: Ticker
    size: string
    total: string
  }

  export interface RuntimeAccount {
    network: Network
    layer: Layer
    address_eth?: string
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

  export interface Validator {
    ticker: Ticker
  }

  export interface Proposal {
    network: Network
    layer: typeof Layer.consensus
  }

  export interface Delegation {
    network: Network
    layer: typeof Layer.consensus
    ticker: Ticker
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
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
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
                fee: fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals),
                charged_fee: fromBaseUnits(tx.charged_fee, paraTimesConfig[runtime].decimals),
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
                layer: runtime,
                network,
                ticker:
                  tx.body?.amount?.Denomination ?? getTokensForScope({ network, layer: runtime })[0].ticker,
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
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
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

export const useGetRuntimeTransactionsTxHash: typeof generated.useGetRuntimeTransactionsTxHash = (
  network,
  runtime,
  txHash,
  options?,
) => {
  // Sometimes we will call this with an undefined txHash, so we must be careful here.
  const actualHash = txHash?.startsWith('0x') ? txHash.substring(2) : txHash
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
                fee: fromBaseUnits(tx.fee, paraTimesConfig[runtime].decimals),
                charged_fee: fromBaseUnits(tx.charged_fee, paraTimesConfig[runtime].decimals),
                amount: tx.amount ? fromBaseUnits(tx.amount, paraTimesConfig[runtime].decimals) : undefined,
                layer: runtime,
                network,
                ticker:
                  tx.body?.amount?.Denomination ?? getTokensForScope({ network, layer: runtime })[0].ticker,
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
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusAccountsAddress(network, address, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Account, headers, status) => {
          if (status !== 200) return data
          // TODO: remove defaults when API is updated
          const { available, delegations_balance = 0, debonding_delegations_balance = 0 } = data
          const total =
            BigInt(data.available) + BigInt(delegations_balance) + BigInt(debonding_delegations_balance)
          return {
            ...data,
            available: fromBaseUnits(available, consensusDecimals),
            total: fromBaseUnits(total.toString(), consensusDecimals),
            delegations_balance: fromBaseUnits(delegations_balance.toString(), consensusDecimals),
            debonding_delegations_balance: fromBaseUnits(
              debonding_delegations_balance.toString(),
              consensusDecimals,
            ),
            layer: Layer.consensus,
            network,
            size: getAccountSize(total),
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
  options,
) => {
  const [rpcAccountBalance, setRpcAccountBalance] = useState<string | null>(null)

  const oasisAddress = useTransformToOasisAddress(address)

  const query = generated.useGetRuntimeAccountsAddress(network, runtime, oasisAddress!, {
    ...options,
    query: {
      ...(options?.query ?? {}),
      enabled: !!oasisAddress && (options?.query?.enabled ?? true),
    },
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.RuntimeAccount, headers, status) => {
          if (status !== 200) return data
          return groupAccountTokenBalances({
            ...data,
            address_eth: getEthAddressForAccount(data, address),
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
          })
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  }) as UseQueryResult<
    Awaited<ReturnType<typeof GetRuntimeAccountsAddress>>,
    HumanReadableErrorResponse | NotFoundErrorResponse
  > & { queryKey: QueryKey }

  const runtimeAccount = query.data?.data as RuntimeAccount

  // TODO: Remove after account balances on Nexus are in sync with the node
  useEffect(() => {
    // Trigger only if the account has been fetched from Nexus and is not a contract and has eth address
    if (!runtimeAccount || !!runtimeAccount.evm_contract || !runtimeAccount.address_eth) {
      return
    }

    let shouldUpdate = true

    const fetchAccountBalance = async () => {
      setRpcAccountBalance(null)

      const balance = await RpcUtils.getAccountBalance(runtimeAccount.address_eth!, {
        context: {
          network: runtimeAccount.network,
          layer: runtimeAccount.layer,
        },
      })

      if (shouldUpdate) {
        setRpcAccountBalance(balance)
      }
    }

    fetchAccountBalance()

    return () => {
      shouldUpdate = false
    }
  }, [runtimeAccount])

  const data: any =
    rpcAccountBalance !== null && runtimeAccount
      ? {
          ...runtimeAccount,
          balances: runtimeAccount.balances?.length
            ? [
                {
                  ...runtimeAccount.balances[0],
                  balance: rpcAccountBalance,
                },
              ]
            : [],
        }
      : runtimeAccount

  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          data,
        }
      : query.data,
    // TypeScript complaining for no good reason
  } as any
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

export function useGetConsensusBlockByHash(
  network: Network,
  blockHash: string,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const result = generated.useGetConsensusBlocks(
    network,
    { hash: blockHash },
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

export function useGetRuntimeBlockByHash(
  network: Network,
  runtime: generated.Runtime,
  blockHash: string,
  options?: { query?: UseQueryOptions<any, any> },
) {
  const params: generated.GetRuntimeBlocksParams = { hash: blockHash }
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
            if (!block || block.hash !== blockHash) {
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
  const oasisAddress = useTransformToOasisAddress(address)

  return generated.useGetRuntimeEvmTokensAddress(network, runtime, oasisAddress!, {
    ...options,
    query: {
      ...(options?.query ?? {}),
      enabled: !!oasisAddress && (options?.query?.enabled ?? true),
    },
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

const fixChecksumAddressInEvmEventParam = (param: generated.EvmAbiParam): generated.EvmAbiParam =>
  param.evm_type === 'address'
    ? {
        ...param,
        value: toChecksumAddress(param.value as string),
      }
    : param

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
          if (status !== 200) return data
          return {
            ...data,
            events: data.events.map(event => {
              const adjustedHash = event.eth_tx_hash ? `0x${event.eth_tx_hash}` : undefined
              if (
                event.type === RuntimeEventType.accountstransfer ||
                event.type === RuntimeEventType.accountsmint ||
                event.type === RuntimeEventType.accountsburn ||
                event.type === RuntimeEventType.consensus_accountsdeposit ||
                event.type === RuntimeEventType.consensus_accountswithdraw ||
                event.type === RuntimeEventType.consensus_accountsdelegate ||
                event.type === RuntimeEventType.consensus_accountsundelegate_done
              ) {
                return {
                  ...event,
                  evm_log_params: event.evm_log_params?.map(fixChecksumAddressInEvmEventParam),
                  eth_tx_hash: adjustedHash,
                  body: {
                    ...event.body,
                    amount:
                      // If there's no denomination then use runtime's native. Otherwise unknown (would have to get by token name?).
                      event.body.amount.Denomination === ''
                        ? {
                            ...event.body.amount,
                            Amount: fromBaseUnits(event.body.Amount, paraTimesConfig[runtime].decimals),
                            Denomination: getTokensForScope({ network, layer: runtime })[0].ticker,
                          }
                        : event.body.amount,
                  },
                  layer: runtime,
                  network,
                }
              }
              return {
                ...event,
                evm_log_params: event.evm_log_params?.map(fixChecksumAddressInEvmEventParam),
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

export const useGetConsensusProposals: typeof generated.useGetConsensusProposals = (
  network,
  params?,
  options?,
) => {
  return generated.useGetConsensusProposals(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.ProposalList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            proposals: data.proposals.map(proposal => {
              return {
                ...proposal,
                network,
                layer: Layer.consensus,
                deposit: fromBaseUnits(proposal.deposit, consensusDecimals),
              }
            }),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusProposalsProposalId: typeof generated.useGetConsensusProposalsProposalId = (
  network,
  proposalId,
  options?,
) => {
  return generated.useGetConsensusProposalsProposalId(network, proposalId, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.Proposal, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            network,
            layer: Layer.consensus,
            deposit: fromBaseUnits(data.deposit, consensusDecimals),
          }
        },
        ...arrayify(options?.request?.transformResponse),
      ],
    },
  })
}

export const useGetConsensusProposalsByName = (network: Network, nameFragment: string | undefined) => {
  const query = useGetConsensusProposals(network, {}, { query: { enabled: !!nameFragment } })
  const { isLoading, isInitialLoading, data, status, error } = query
  const textMatcher = nameFragment
    ? (proposal: generated.Proposal): boolean =>
        !!proposal.handler && proposal.handler?.includes(nameFragment)
    : () => false
  const results = data ? query.data.data.proposals.filter(textMatcher) : undefined
  return {
    isLoading,
    isInitialLoading,
    status,
    error,
    results,
  }
}

export const useGetConsensusValidators: typeof generated.useGetConsensusValidators = (
  network,
  params?,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusValidators(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.ValidatorList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            validators: data.validators.map(validator => {
              return {
                ...validator,
                escrow: fromBaseUnits(validator.escrow, consensusDecimals),
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

export const useGetConsensusAccounts: typeof generated.useGetConsensusAccounts = (
  network,
  params?,
  options?,
) => {
  const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
  return generated.useGetConsensusAccounts(network, params, {
    ...options,
    request: {
      ...options?.request,
      transformResponse: [
        ...arrayify(axios.defaults.transformResponse),
        (data: generated.AccountList, headers, status) => {
          if (status !== 200) return data
          return {
            ...data,
            accounts: data.accounts.map(account => {
              // TODO: remove when API returns total value, looking at query filters we store that data in Nexus
              // or sum proper fields when they are available. Currently API does not return correct fields in accounts list endpoint
              // https://github.com/oasisprotocol/explorer/pull/1160#discussion_r1459577303
              const total = BigInt(account.available)
              return {
                ...account,
                available: fromBaseUnits(account.available, consensusDecimals),
                total: fromBaseUnits(total.toString(), consensusDecimals),
                layer: Layer.consensus,
                network,
                size: getAccountSize(total),
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

export const useGetConsensusAccountsAddressDelegations: typeof generated.useGetConsensusAccountsAddressDelegations =
  (network, address, params?, options?) => {
    const ticker = getTokensForScope({ network, layer: Layer.consensus })[0].ticker
    return generated.useGetConsensusAccountsAddressDelegations(network, address, params, {
      ...options,
      request: {
        ...options?.request,
        transformResponse: [
          ...arrayify(axios.defaults.transformResponse),
          (data: generated.DelegationList, headers, status) => {
            if (status !== 200) return data
            return {
              ...data,
              delegations: data.delegations.map(delegation => {
                return {
                  ...delegation,
                  shares: fromBaseUnits(delegation.shares, consensusDecimals),
                  amount: fromBaseUnits(delegation.amount, consensusDecimals),
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
