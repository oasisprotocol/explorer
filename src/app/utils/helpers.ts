import { toChecksumAddress } from '@ethereumjs/util'
import { Buffer } from 'buffer'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
// eslint-disable-next-line no-restricted-imports
import { AddressPreimage } from '../../oasis-indexer/generated/api'

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

export async function getEvmBech32Address(evmAddress: string) {
  const ethAddrU8 = oasis.misc.fromHex(evmAddress.replace('0x', ''))
  const addr = await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    ethAddrU8,
  )
  return oasis.staking.addressToBech32(addr)
}

export const getOasisAddress = async (address: string): Promise<string> => {
  if (isValidOasisAddress(address)) {
    return address
  } else if (isValidEthAddress(address)) {
    return await getEvmBech32Address(address)
  } else {
    throw new Error('Invalid address')
  }
}

export const isValidTxOasisHash = (hash: string): boolean => /^[0-9a-fA-F]{64}$/.test(hash)

export const isValidTxEthHash = (hash: string): boolean => /^0x[0-9a-fA-F]{64}$/.test(hash)

export const isValidTxHash = (hash: string) => isValidTxOasisHash(hash) || isValidTxEthHash(hash)

export function getEthAccountAddress(preimage: AddressPreimage | undefined): string | undefined {
  if (preimage?.context !== 'oasis-runtime-sdk/address: secp256k1eth' || !preimage.address_data) {
    // We can only determine the ETH address if there was a preimage,
    // and the generation context was secp256k1eth
    return undefined
  }
  // We need to convert from base64 to hex, add the prefix, and convert to checksum address
  return toChecksumAddress(`0x${Buffer.from(preimage.address_data, 'base64').toString('hex')}`)
}
