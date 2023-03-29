import { getEthAccountAddress } from '../helpers'
import { suggestedParsedAccount } from '../test-fixtures'

describe('getEthAccountAddress', () => {
  // TODO: enable when jest fixes "TypeError: Expected Uint8Array"
  // https://github.com/facebook/jest/issues/4422
  it.skip('should convert preimage to evm addresses', () => {
    expect(getEthAccountAddress(suggestedParsedAccount.address_preimage)).toEqual(
      suggestedParsedAccount.address_eth,
    )
  })
})
