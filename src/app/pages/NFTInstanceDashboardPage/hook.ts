import { SearchScope } from '../../../types/searchScope'
import type { EvmNft } from '../../../oasis-nexus/api'

export const useInstanceInfo = (scope: SearchScope, contractAddress: string, instanceId: string) => {
  const isLoading = false
  // TODO: load real data here
  const instance: EvmNft | undefined = {
    contract_addr: 'oasis1qrels9582m4wf25guu5057wtg74jncvqay8u6947',
    description: 'Thank you for participating in the DeFi MOOC 2021,the first-ever MOOC in DeFi!',
    eth_contract_addr: '0xea27EdC49882eDe0208A2863915819fb1DB3eFfB',
    id: '308',
    image: 'ipfs://QmbaHVxK6Ru8p4SL3cZuzNmPNH6kE9y5TDFHWuGmKtzpto/TRAILBLAZER_UIUC.png',
    metadata_accessed: '2023-09-28 15:05:02.746194 +0000 UTC',
    metadata_uri: 'ipfs://QmYCGCCkmkphoJAT46penq8UCB5V7XACnV7swECt3TPpEN/15',
    name: 'TRAILBLAZER_UIUC',
    token_name: 'DeFi MOOC 2021 NFT',
    token_symbol: 'MOOC2021',
    token_total_supply: '331',
    token_type: 'ERC721',
  }
  return {
    isLoading,
    instance,
  }
}
