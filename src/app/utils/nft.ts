import { EvmNft } from 'oasis-nexus/api'

export const getNftInstanceLabel = (nft: EvmNft) =>
  nft.token.name ? `${nft.token.name} #${nft.id}` : `#${nft.id}`
