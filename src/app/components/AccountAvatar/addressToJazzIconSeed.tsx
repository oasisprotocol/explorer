import { staking } from '@oasisprotocol/client'

const ethAddressToSeed = (address_eth: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L20-L25
  // https://github.com/MetaMask/metamask-extension/blob/v10.7.0/ui/helpers/utils/icon-factory.js#L84-L88
  const addr = address_eth.slice(2, 10)
  const seed = parseInt(addr, 16)
  return seed
}

const oasisAddressToSeed = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)
  return seed
}

export function addressToJazzIconSeed(account: { address: string; address_eth?: string }) {
  return account.address_eth ? ethAddressToSeed(account.address_eth) : oasisAddressToSeed(account.address)
}
