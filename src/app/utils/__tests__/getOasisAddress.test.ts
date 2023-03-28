import { getOasisAddress } from '../helpers'
import { suggestedParsedAccount } from '../test-fixtures'

describe('getOasisAddress', () => {
  it('should recognize oasis addresses', async () => {
    await expect(getOasisAddress('oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4')).resolves.toEqual(
      'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
    )
  })

  it('should convert evm addresses', async () => {
    // https://github.com/oasisprotocol/oasis-sdk/blob/22b9e3f972599b56609b7febd9d1ef4cf2437925/client-sdk/go/helpers/address_test.go#L35
    await expect(getOasisAddress('0x60a6321eA71d37102Dbf923AAe2E08d005C4e403')).resolves.toEqual(
      'oasis1qpaqumrpewltmh9mr73hteycfzveus2rvvn8w5sp',
    )

    await expect(getOasisAddress(suggestedParsedAccount.address_eth!)).resolves.toEqual(
      suggestedParsedAccount.address,
    )
  })

  it('should throw for invalid addresses', async () => {
    await expect(getOasisAddress('aaaaaaaaaaaaaaaaaa')).rejects.toThrow()
  })
})
