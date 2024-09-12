import { RuntimeAccount } from '../../../oasis-nexus/api'
import { base64ToHex } from '../../utils/helpers'
import { toChecksumAddress } from '@ethereumjs/util'

/** https://eips.ethereum.org/EIPS/eip-1167 */
export function extractMinimalProxyERC1167(account: RuntimeAccount) {
  if (!account?.evm_contract?.runtime_bytecode) return undefined

  const hexBytecode = base64ToHex(account.evm_contract.runtime_bytecode)

  const proxyToAddress1 = hexBytecode.match(
    /^0x363d3d373d3d3d363d73([0-9a-fA-F]{40})5af43d82803e903d91602b57fd5bf3$/,
  )?.[1]
  if (proxyToAddress1) return toChecksumAddress(`0x${proxyToAddress1}`)

  // Optimized version
  const proxyToAddress2 = hexBytecode.match(
    /^0x363d3d373d3d3d363d6f([0-9a-fA-F]{32})5af43d82803e903d91602757fd5bf3$/,
  )?.[1]
  if (proxyToAddress2) return toChecksumAddress(`0x00000000${proxyToAddress2}`)

  return undefined
}
