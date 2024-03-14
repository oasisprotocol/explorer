import { addressToJazzIconSeed } from '../addressToJazzIconSeed'

test('Consensus addressToJazzIconSeed for JazzIcon should return the same value as wallets', () => {
  expect(addressToJazzIconSeed({ address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe' })).toBe(
    -323287268,
  )
  expect(addressToJazzIconSeed({ address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk' })).toBe(-77419490)
})

test('EVM addressToJazzIconSeed for JazzIcon should return the same value as metamask', () => {
  expect(
    addressToJazzIconSeed({
      address_eth: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      address: 'oasis1qqyehmqgp04swwv2vtz7lhy937r6m4wtmuxk9rtk',
    }),
  ).toBe(3670114197)
  expect(
    addressToJazzIconSeed({
      address_eth: '0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3',
      address: 'oasis1qpdgv5nv2dhxp4q897cgag6kgnm9qs0dccwnckuu',
    }),
  ).toBe(2344792112)
})
