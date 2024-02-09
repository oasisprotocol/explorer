import { Layer } from '../../oasis-nexus/api'

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

const docsUrl = 'https://docs.oasis.io/'
const consensusDocsUrl = `${docsUrl}core/consensus/`
export const docs = {
  home: docsUrl,
  consensus: consensusDocsUrl,
  consensusTransactions: `${consensusDocsUrl}transactions/`,
  consensusServices: `${consensusDocsUrl}services/`,
  consensusGenesis: `${consensusDocsUrl}genesis/`,
  consensusVectors: `${consensusDocsUrl}test-vectors/`,
  consensusComet: `${consensusDocsUrl}#cometbft`,
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

const faucetUrl = 'https://faucet.testnet.oasis.dev/'
const faucetParaTimeBaseUrl = `${faucetUrl}?paratime=`
export const faucet = {
  [Layer.consensus]: faucetUrl,
  [Layer.emerald]: `${faucetParaTimeBaseUrl}emerald`,
  [Layer.sapphire]: `${faucetParaTimeBaseUrl}sapphire`,
  [Layer.pontusx]: 'mailto:contact@delta-dao.com?subject=tokens',
  [Layer.cipher]: `${faucetParaTimeBaseUrl}cipher`,
}

export const api = {
  spec: `${process.env.REACT_APP_API}spec/v1.html`,
}

export const ipfs = {
  proxyPrefix: 'https://ipfs.io/ipfs/',
}
