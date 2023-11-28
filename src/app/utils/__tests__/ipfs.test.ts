import { accessIpfsUrl } from '../ipfs'

describe('accessIpfsUrl', () => {
  it('should return valid https url', () => {
    expect(
      accessIpfsUrl('ipfs://QmbaHVxK6Ru8p4SL3cZuzNmPNH6kE9y5TDFHWuGmKtzpto/TRAILBLAZER_Stanford.png'),
    ).toEqual('https://ipfs.io/ipfs/QmbaHVxK6Ru8p4SL3cZuzNmPNH6kE9y5TDFHWuGmKtzpto/TRAILBLAZER_Stanford.png')
  })
})
