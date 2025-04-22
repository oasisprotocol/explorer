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

export const marketingPage = {
  tokenomics: `https://oasisprotocol.org/rose-and-tokenomics`,
  validators: `https://oasisprotocol.org/node-operators`,
}

export const docs = {
  cipher: `https://docs.oasis.io/dapp/cipher`,
  consensus: 'https://docs.oasis.io/core/consensus',
  delegation: `https://docs.oasis.io/general/manage-tokens/staking-and-delegating`,
  emerald: `https://docs.oasis.io/dapp/emerald/`,
  emeraldGateway: `https://docs.oasis.io/dapp/emerald/#web3-gateway`,
  emeraldTestnet: `https://docs.oasis.io/dapp/emerald/#testnet`,
  emeraldTestnetNode: `https://docs.oasis.io/node/testnet/#emerald`,
  home: 'https://docs.oasis.io/',
  localnet: 'https://docs.oasis.io/build/tools/localnet',
  manageTokens: `https://docs.oasis.io/general/manage-tokens`,
  node: `https://docs.oasis.io/get-involved/run-node/validator-node`,
  paraTimeTransfer: `https://docs.oasis.io/general/manage-tokens/oasis-wallets/web#paratimes`,
  pontusx1: 'https://docs.pontus-x.eu/',
  pontusx2: 'https://docs.pontus-x.eu/docs/getting-started/quick-start',
  pontusx3: 'https://github.com/deltaDAO/mvg-portal/blob/main/chains.config.js',
  sapphire: `https://docs.oasis.io/dapp/sapphire/`,
  sapphireTestnet: `https://docs.oasis.io/dapp/sapphire/#testnet`,
  sapphireTestnetHardhat: `https://docs.oasis.io/dapp/sapphire/quickstart/#add-the-sapphire-testnet-to-hardhat`,
  sapphireTestnetNode: `https://docs.oasis.io/node/testnet/#sapphire`,
  token: `https://docs.oasis.io/general/oasis-network/token-metrics-and-distribution`,
  tools: 'https://docs.oasis.io/build/tools',
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
  wRose: 'https://rose.oasis.io/wrap',
  sourcifyRoot: 'https://sourcify.dev/',
  abiPlayground: 'https://abi-playground.oasis.io/',
}

export const api = {
  spec: `${process.env.REACT_APP_API}spec/v1.html`,
  oasis_named_addresses_mainnet_consensus:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/mainnet_consensus.json',
  oasis_named_addresses_mainnet_emerald:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/mainnet_emerald.json',
  oasis_named_addresses_mainnet_sapphire:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/mainnet_sapphire.json',
  oasis_named_addresses_testnet_consensus:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/testnet_consensus.json',
  oasis_named_addresses_testnet_emerald:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/testnet_emerald.json',
  oasis_named_addresses_testnet_sapphire:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/testnet_sapphire.json',
  oasis_named_addresses_testnet_pontusxdev:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/testnet_pontusxdev.json',
  oasis_named_addresses_testnet_pontusxtest:
    'https://raw.githubusercontent.com/oasisprotocol/nexus/main/named-addresses/testnet_pontusxtest.json',
  deltadao_named_addresses:
    'https://raw.githubusercontent.com/deltaDAO/mvg-portal/main/pontusxAddresses.json',
}

export const ipfs = {
  proxyPrefix: 'https://ipfs.io/ipfs/',
}

export const wallet = {
  homepage: 'https://wallet.oasis.io/',
}
