import { RuntimeAccount } from '../../../oasis-nexus/api'
import { base64ToHex } from '../../utils/helpers'
import { toChecksumAddress } from '@ethereumjs/util'

/** https://eips.ethereum.org/EIPS/eip-1167 */
export function extractMinimalProxyERC1167(account: RuntimeAccount) {
  if (!account?.evm_contract?.runtime_bytecode) return undefined

  const hexBytecode = base64ToHex(account.evm_contract.runtime_bytecode)

  // https://explorer.dev.oasis.io/testnet/sapphire/address/0xbA7F3eE55b7939294caFA0F1e096E79722e1BD88/code#code
  const proxyToAddress1 = hexBytecode.match(
    /^0x363d3d373d3d3d363d73([0-9a-fA-F]{40})5af43d82803e903d91602b57fd5bf3$/,
  )?.[1]
  if (proxyToAddress1) return toChecksumAddress(`0x${proxyToAddress1}`)

  // Optimized version
  const proxyToAddress2 = hexBytecode.match(
    /^0x363d3d373d3d3d363d6f([0-9a-fA-F]{32})5af43d82803e903d91602757fd5bf3$/,
  )?.[1]
  if (proxyToAddress2) return toChecksumAddress(`0x00000000${proxyToAddress2}`)

  // 0age's minimal proxy - https://medium.com/coinmonks/the-more-minimal-proxy-5756ae08ee48
  // Created using thirdweb https://explorer.oasis.io/testnet/sapphire/address/0xd5fc21B36D5153Cd0bfF4d774539ba9dFd13ADA8/code#code
  const proxyToAddress3 = hexBytecode.match(
    /^0x3d3d3d3d363d3d37363d73([0-9a-fA-F]{40})5af43d3d93803e602a57fd5bf3$/,
  )?.[1]
  if (proxyToAddress3) return toChecksumAddress(`0x${proxyToAddress3}`)

  // Support more?
  // https://github.com/thirdweb-dev/js/blob/1607229b21cb3dde3647c4121fff90612cc77275/packages/thirdweb/src/utils/bytecode/extractMinimalProxyImplementationAddress.ts#L13
  // https://github.com/ApeWorX/ape/blob/9858def38564b0e96ad3fb03edb05084667cd263/src/ape_ethereum/ecosystem.py#L476-L487

  return undefined
}
