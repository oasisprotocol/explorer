/** @file Put all external links into this file so tests make sure links are still reachable */

export const socialMedia = {
  telegram: process.env.REACT_APP_SOCIAL_TELEGRAM,
  twitter: process.env.REACT_APP_SOCIAL_TWITTER,
  discord: process.env.REACT_APP_SOCIAL_DISCORD,
  // This API link is for testing if invite is still valid.
  isDiscordStillValid: 'https://oasis.io/discord/invite-api-check',
  youtube: process.env.REACT_APP_SOCIAL_YOUTUBE,
  reddit: process.env.REACT_APP_SOCIAL_REDDIT,
  linkedin: process.env.REACT_APP_SOCIAL_LINKEDIN,
  docs: process.env.REACT_APP_SOCIAL_DOCS,
  home: process.env.REACT_APP_SOCIAL_HOME,
}

export const docs = {
  home: 'https://docs.oasis.io/',
  consensus: 'https://docs.oasis.io/core/consensus/',
  consensusTransactions: `https://docs.oasis.io/core/consensus/transactions/`,
  consensusServices: `https://docs.oasis.io/core/consensus/services/`,
  consensusGenesis: `https://docs.oasis.io/core/consensus/genesis/`,
  consensusVectors: `https://docs.oasis.io/core/consensus/test-vectors/`,
  consensusComet: `https://docs.oasis.io/core/consensus/#cometbft`,
  cipher: `https://docs.oasis.io/dapp/cipher/`,
  emerald: `https://docs.oasis.io/dapp/emerald/`,
  emeraldTestnet: `https://docs.oasis.io/dapp/emerald/#testnet`,
  emeraldTestnetNode: `https://docs.oasis.io/node/testnet/#emerald`,
  emeraldGateway: `https://docs.oasis.io/dapp/emerald/#web3-gateway`,
  localnet: 'https://docs.oasis.io/build/tools/localnet',
  sapphire: `https://docs.oasis.io/dapp/sapphire/`,
  token: `https://docs.oasis.io/general/oasis-network/token-metrics-and-distribution`,
  tools: 'https://docs.oasis.io/build/tools/',
  paraTimeTransfer: `https://docs.oasis.io/general/manage-tokens/oasis-wallets/web#paratimes`,
  sapphireTestnetNode: `https://docs.oasis.io/node/testnet/#sapphire`,
  sapphireTestnet: `https://docs.oasis.io/dapp/sapphire/#testnet`,
  sapphireTestnetHardhat: `https://docs.oasis.io/dapp/sapphire/quickstart/#add-the-sapphire-testnet-to-hardhat`,
  pontusx1: 'https://docs.pontus-x.eu/',
  pontusx2: 'https://docs.pontus-x.eu/docs/getting-started/quick-start',
  pontusx3: 'https://github.com/deltaDAO/mvg-portal/blob/main/chains.config.js',
}

export const referrals = { coinGecko: 'https://www.coingecko.com' }

export const github = {
  home: 'https://github.com/oasisprotocol/explorer/',
  commit: `https://github.com/oasisprotocol/explorer/commit/`,
  releaseTag: `https://github.com/oasisprotocol/explorer/releases/tag/`,
}

export const faucets = {
  oasisTestnet: 'https://faucet.testnet.oasis.io/',
}

export const dapps = {
  wRose: 'https://wrose.oasis.io/',
  sourcifyRoot: 'https://sourcify.dev/',
  abiPlayground: 'https://abi-playground.oasis.io/',
}

export const api = {
  spec: `${process.env.REACT_APP_API}spec/v1.html`,
}

export const ipfs = {
  proxyPrefix: 'https://ipfs.io/ipfs/',
}

export const wallet = {
  homepage: 'https://wallet.oasis.io/',
}
