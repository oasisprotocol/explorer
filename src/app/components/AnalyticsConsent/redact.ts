export function redactURL(u: string) {
  return (
    u
      // https://explorer.dev.oasis.io/mainnet/emerald/tx/0xf0f08f00150f5d4273c0cf07f36ee7545e5e130e477a8528271379ce3628e104
      // https://explorer.dev.oasis.io/mainnet/sapphire/address/0xEd03EA9c96ec39097548256E428a163E5f524e47/tokens/erc-721#0xFcfed3be2d333F24854cA8d3A351E772272D5842
      .replaceAll(/0x[a-f0-9]+/gi, '0x...')
      // https://explorer.dev.oasis.io/mainnet/emerald/address/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t
      // https://explorer.dev.oasis.io/search?q=oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t
      .replaceAll(/oasis1[a-z0-9]+/gi, 'oasis1...')
      // https://explorer.dev.oasis.io/mainnet/emerald/tx/aa5a562c714c9a4e8ecd88230757bc60f66765e56bd4645e11198457b8b278dd
      .replaceAll(/[0-9a-f]{64}/gi, '...')
      // https://explorer.dev.oasis.io/search?q=test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20key
      .replaceAll(/([?&]q=)[^&#]*/gi, '$1...')
  )
}
