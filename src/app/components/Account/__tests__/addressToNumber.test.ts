import { addressToNumber } from '..'

test('addressToNumber for JazzIcon should return the same value as wallets', () => {
  expect(addressToNumber('oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe')).toBe(-323287268)
  expect(addressToNumber('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')).toBe(-77419490)
})
