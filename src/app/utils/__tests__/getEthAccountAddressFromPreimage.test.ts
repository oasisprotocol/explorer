import { getEthAccountAddressFromPreimage } from '../helpers'
import { suggestedEmptyAccount, suggestedParsedAccount } from '../test-fixtures'

describe('getEthAccountAddressFromPreimage', () => {
  it('should convert preimage to evm addresses', () => {
    expect(getEthAccountAddressFromPreimage(suggestedParsedAccount.address_preimage)).toEqual(
      suggestedParsedAccount.address_eth,
    )
  })

  it('should return undefined on empty account', () => {
    expect(getEthAccountAddressFromPreimage(suggestedEmptyAccount.address_preimage)).toBeUndefined()
  })
})
