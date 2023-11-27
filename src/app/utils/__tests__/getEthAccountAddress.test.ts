import { getEthAccountAddressFromPreimage, getEthAddressForAccount } from '../helpers'
import { suggestedEmptyAccount, suggestedParsedAccount } from '../test-fixtures'

describe('getEthAccountAddress', () => {
  // TODO: enable when jest fixes "TypeError: Expected Uint8Array"
  // https://github.com/facebook/jest/issues/4422
  it.skip('should convert preimage to evm addresses', () => {
    expect(getEthAccountAddressFromPreimage(suggestedParsedAccount.address_preimage)).toEqual(
      suggestedParsedAccount.address_eth,
    )
  })

  it('should return input address on empty account', () => {
    const validEthAddress = suggestedParsedAccount.address_eth
    expect(getEthAddressForAccount(suggestedEmptyAccount, validEthAddress)).toBe(
      '0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3',
    )
  })

  it('should return undefined on empty account with invalid ETH address', () => {
    expect(getEthAddressForAccount(suggestedEmptyAccount, '0x0')).toBeUndefined()
  })

  it('should return undefined on empty account with undefined supplied as ETH address', () => {
    expect(getEthAddressForAccount(suggestedEmptyAccount, undefined)).toBeUndefined()
  })

  it('should valid address from preimage', () => {
    expect(getEthAddressForAccount(suggestedParsedAccount, undefined)).toBe(
      suggestedParsedAccount.address_eth,
    )
  })
})
