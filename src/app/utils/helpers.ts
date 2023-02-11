import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'

export const isValidBlockHeight = (blockHeight: string): boolean => !isNaN(Number(blockHeight))
export const isValidBlockHash = (hash: string): boolean => /^[0-9a-fA-F]{64}$/.test(hash)

export const isValidOasisAddress = (addr: string): boolean => {
  try {
    oasis.staking.addressFromBech32(addr)
    return true
  } catch (e) {
    return false
  }
}

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

export const isValidTxHash = (hash: string): boolean => /^[0-9a-fA-F]{64}$/.test(hash)
