import { EvmTokenType, groupAccountTokenBalances, Layer, RuntimeAccount } from '../../oasis-nexus/api'
import { Network } from '../../types/network'
import { AccountResult, BlockResult } from '../pages/SearchResultsPage/hooks'

export const suggestedParsedBlock: BlockResult = {
  round: 1396255,
  hash: '42efb4c989d219842aa0c5f7fa11fd24f913612a7235d4564b95caf8aa20fb8b',
  timestamp: '2022-05-13T06:39:03Z',
  size: 4214,
  num_transactions: 10,
  gas_used: 1482530,
  layer: Layer.emerald,
  network: Network.mainnet,
  resultType: 'block',
}

export const sapphireParsedBlock: BlockResult = {
  round: 143553,
  hash: '91cc80baead4779221cadfe756a959273697850f9ef994b0e2b2ac0a178b86ca',
  timestamp: '2023-02-17T10:57:09Z',
  size: 292,
  num_transactions: 1,
  gas_used: 11292,
  layer: Layer.sapphire,
  network: Network.mainnet,
  resultType: 'block',
}

export const suggestedParsedAccount: RuntimeAccount = groupAccountTokenBalances({
  address: 'oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t',
  address_preimage: {
    address_data: 'ulBIGP3Y09ui74/ZtPTVxxrR0dM=',
    context: 'oasis-runtime-sdk/address: secp256k1eth',
    context_version: 0,
  },
  address_eth: '0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3',
  balances: [],
  evm_balances: [
    {
      balance: '337325.438367711264207872',
      token_contract_addr: 'oasis1qpssvkplnlpzdvwxpgmrhf9j5lkyvaylcvujhjhg',
      token_contract_addr_eth: '0xF8E3DE55D24D13607A12628E0A113B66BA578bD1',
      token_decimals: 18,
      token_name: 'FTP',
      token_symbol: 'FTP',
      token_type: EvmTokenType.ERC20,
    },
    {
      balance: '-3372955.09999999999999995',
      token_contract_addr: 'oasis1qqz8706pmf38wmptl6dkcaec8yykw0rvfv7ql6fc',
      token_contract_addr_eth: '0xF8E3DE55D24D13607A12628E0A113B66BA578bD2',
      token_decimals: 18,
      token_name: 'YUZU',
      token_symbol: 'YUZU',
      token_type: EvmTokenType.ERC20,
    },
  ],
  stats: {
    num_txns: 55313,
    total_received: '0',
    total_sent: '0',
  },
  layer: Layer.emerald,
  network: Network.mainnet,
})

export const suggestedEmptyAccount: RuntimeAccount = groupAccountTokenBalances({
  address: 'oasis1qz64azk6qr5nzq537l5cgpd4uxltrhpkhqdx5tqy',
  address_preimage: undefined,
  address_eth: undefined,
  balances: [],
  evm_balances: [],
  stats: {
    num_txns: 0,
    total_received: '0',
    total_sent: '0',
  },
  layer: Layer.emerald,
  network: Network.mainnet,
  evm_contract: undefined,
})

export const suggestedParsedAccountResult: AccountResult = {
  ...suggestedParsedAccount,
  resultType: 'account',
}
