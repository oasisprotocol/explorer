export const socialMedia = {
  telegram: 'https://t.me/oasisprotocolcommunity',
  twitter: 'https://twitter.com/oasisprotocol',
  discord: 'https://oasis.io/discord',
  // This API link is for testing if invite is still valid.
  isDiscordStillValid: 'https://oasis.io/discord/invite-api-check',
  youtube: 'https://www.youtube.com/channel/UC35UFPcZ2F1wjPxhPrSsESQ',
  reddit: 'https://www.reddit.com/r/oasisnetwork/',
}

const docsUrl = 'https://docs.oasis.io/'
export const docs = {
  home: docsUrl,
  consensus: `${docsUrl}core/consensus/`,
  cipher: `${docsUrl}dapp/cipher/`,
  emerald: `${docsUrl}dapp/emerald/`,
  emeraldTestnet: `${docsUrl}dapp/emerald/#testnet`,
  emeraldTestnetNode: `${docsUrl}node/testnet/#emerald`,
  emeraldGateway: `${docsUrl}dapp/emerald/#web3-gateway`,
  sapphire: `${docsUrl}dapp/sapphire/`,
  token: `${docsUrl}general/oasis-network/token-metrics-and-distribution`,
  paraTimeTransfer: `${docsUrl}general/manage-tokens/how-to-transfer-rose-into-paratime`,
  sapphireTestnetNode: `${docsUrl}node/testnet/#sapphire`,
  sapphireTestnet: `${docsUrl}dapp/sapphire/#testnet`,
  sapphireTestnetHardhat: `${docsUrl}dapp/sapphire/quickstart/#add-the-sapphire-testnet-to-hardhat`,
}

export const referrals = { coinGecko: 'https://www.coingecko.com' }

const githubLink = 'https://github.com/oasisprotocol/explorer/'
export const github = {
  home: githubLink,
  commit: `${githubLink}commit/`,
  releaseTag: `${githubLink}releases/tag/`,
}

export const testnet = {
  faucet: 'https://faucet.testnet.oasis.dev',
}

export const api = {
  spec: `${process.env.REACT_APP_API}spec/v1.html`,
}

export const ipfs = {
  proxyPrefix: 'https://ipfs.io/ipfs/',
}
