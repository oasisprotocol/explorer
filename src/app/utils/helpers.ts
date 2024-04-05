import { toChecksumAddress } from '@ethereumjs/util'
import { Buffer } from 'buffer'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
// eslint-disable-next-line no-restricted-imports
import { AddressPreimage, RuntimeAccount } from '../../oasis-nexus/generated/api'
import BigNumber from 'bignumber.js'
import { validateMnemonic } from 'bip39'
import { sha512_256 } from 'js-sha512'

export const isValidBlockHeight = (blockHeight: string): boolean => /^[0-9]+$/.test(blockHeight)
export const isValidBlockHash = (hash: string): boolean => /^[0-9a-fA-F]{64}$/.test(hash)

export const isValidOasisAddress = (addr: string): boolean => {
  try {
    oasis.staking.addressFromBech32(addr)
    return true
  } catch (e) {
    return false
  }
}

// TODO: validate checksums with @ethereumjs/util isValidChecksumAddress
export const isValidEthAddress = (hexAddress: string): boolean => {
  return /^0x[0-9a-fA-F]{40}$/.test(hexAddress)
}

export const isValidProposalId = (proposalId: string): boolean => /^[0-9]+$/.test(proposalId)

/** oasis.address.fromData(...) but without being needlessly asynchronous */
function oasisAddressFromDataSync(
  contextIdentifier: string,
  contextVersion: number,
  data: Uint8Array,
): Uint8Array {
  const versionU8 = new Uint8Array([contextVersion])
  return oasis.misc.concat(
    versionU8,
    new Uint8Array(
      sha512_256.arrayBuffer(oasis.misc.concat(oasis.misc.fromString(contextIdentifier), versionU8, data)),
    ).slice(0, 20),
  )
}

export function getEvmBech32Address(evmAddress: string) {
  const ethAddrU8 = oasis.misc.fromHex(evmAddress.replace('0x', ''))
  const addr = oasisAddressFromDataSync(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    ethAddrU8,
  )
  return oasis.staking.addressToBech32(addr)
}

export const getOasisAddress = (address: string): string => {
  if (isValidOasisAddress(address)) {
    return address
  } else if (isValidEthAddress(address)) {
    return getEvmBech32Address(address)
  } else {
    throw new Error('Invalid address')
  }
}

export const isValidTxOasisHash = (hash: string): boolean => /^[0-9a-fA-F]{64}$/.test(hash)

export const isValidTxEthHash = (hash: string): boolean => /^0x[0-9a-fA-F]{64}$/.test(hash)

export const isValidTxHash = (hash: string) => isValidTxOasisHash(hash) || isValidTxEthHash(hash)

// Convert data from base64 to hex
export const base64ToHex = (base64Data: string): string =>
  `0x${Buffer.from(base64Data, 'base64').toString('hex')}`

// Convert address from base64 to hex, add prefix, and convert to checksum address
export function getEthAccountAddressFromBase64(base64Address: string): string {
  return toChecksumAddress(base64ToHex(base64Address))
}

export function getEthAccountAddressFromPreimage(preimage: AddressPreimage | undefined): string | undefined {
  if (preimage?.context !== 'oasis-runtime-sdk/address: secp256k1eth' || !preimage.address_data) {
    // We can only determine the ETH address if there was a preimage,
    // and the generation context was secp256k1eth
    return undefined
  }
  // We need to convert from base64 to hex, add the prefix, and convert to checksum address
  return getEthAccountAddressFromBase64(preimage.address_data)
}

export function getEthAddressForAccount(
  account: RuntimeAccount,
  possibleEthAddress?: string,
): string | undefined {
  // In case of an empty account
  if (account.stats.num_txns <= 0 && possibleEthAddress && isValidEthAddress(possibleEthAddress))
    return possibleEthAddress

  return getEthAccountAddressFromPreimage(account.address_preimage)
}

export function uniq<T>(input: T[] | undefined): T[] {
  return input === undefined ? [] : [...new Set(input)]
}

export function fromBaseUnits(valueInBaseUnits: string, decimals: number): string {
  const value = new BigNumber(valueInBaseUnits).shiftedBy(-decimals) // / 10 ** decimals
  if (value.isNaN()) {
    throw new Error(`Not a number in fromBaseUnits(${valueInBaseUnits})`)
  }
  return value.toFixed()
}

export const isValidMnemonic = (candidate: string): boolean => validateMnemonic(candidate)

export const getAccountSize = (value: bigint) => {
  if (value >= 100_000_000_000_000_000n) {
    return 'XXL'
  } else if (value >= 50_000_000_000_000_000n && value <= 99_999_999_000_000_000n) {
    return 'XL'
  } else if (value >= 25_000_000_000_000_000n && value <= 49_999_999_000_000_000n) {
    return 'L'
  } else if (value >= 1_000_000_000_000_000n && value <= 24_999_999_000_000_000n) {
    return 'M'
  } else if (value >= 500_000_000_000_000n && value <= 999_999_000_000_000n) {
    return 'S'
  } else if (value >= 100_000_000_000_000n && value <= 499_99_000_000_0009n) {
    return 'XS'
  } else {
    return 'XXS'
  }
}
