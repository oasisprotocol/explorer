import { redactURL } from '../redact'

test('redactURL', () => {
  expect(
    [
      'https://explorer.dev.oasis.io/mainnet/emerald/tx/0xf0f08f00150f5d4273c0cf07f36ee7545e5e130e477a8528271379ce3628e104',
      'https://explorer.dev.oasis.io/mainnet/sapphire/address/0xEd03EA9c96ec39097548256E428a163E5f524e47/tokens/erc-721#0xFcfed3be2d333F24854cA8d3A351E772272D5842',
      'https://explorer.dev.oasis.io/mainnet/emerald/address/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t',
      'https://explorer.dev.oasis.io/search?q=oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t',
      'https://explorer.dev.oasis.io/mainnet/emerald/tx/aa5a562c714c9a4e8ecd88230757bc60f66765e56bd4645e11198457b8b278dd',
      'https://explorer.dev.oasis.io/search?q=test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20key',
    ].map(redactURL),
  ).toMatchSnapshot()
})
