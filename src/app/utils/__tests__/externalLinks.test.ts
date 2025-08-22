import { describe, it, expect, vi } from 'vitest'
import nodeFetch from 'node-fetch'
import * as externalLinksModule from '../externalLinks'

vi.setConfig({ testTimeout: 30_000 })

describe('externalLinks', () => {
  it('file should contain groups of links as objects', () => {
    expect(Object.entries(externalLinksModule).length).toBeGreaterThan(0)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_linksGroupName, linksGroup] of Object.entries(externalLinksModule)) {
      expect(typeof linksGroup).toBe('object')
      expect(Object.entries(linksGroup).length).toBeGreaterThan(0)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_linkName, url] of Object.entries(linksGroup)) {
        if (url === undefined) continue
        expect(typeof url).toBe('string')
        expect(url).toMatch(/^(https|mailto):/)
      }
    }
  })

  describe('should be reachable', () => {
    const { reddit, twitter } = externalLinksModule.socialMedia
    for (const [linksGroupName, linksGroup] of Object.entries(externalLinksModule)) {
      for (const [linkName, originalUrl] of Object.entries(linksGroup)) {
        let url = originalUrl
        if (!url || typeof url !== 'string') continue
        if (!!reddit && url.startsWith(reddit)) continue // Reddit often returns 504
        if (!!twitter && url.startsWith(twitter)) continue // redirect loop
        if (url.startsWith(externalLinksModule.referrals.coinGecko)) continue // CoinGecko has CloudFlare DDOS protection
        if (url.startsWith('mailto')) continue // We can't test email addresses

        if (url.startsWith(externalLinksModule.github.commit)) {
          url += '904840745dde1a5dfff6608213e50dfa4d4ee7c8'
        }
        if (url.startsWith(externalLinksModule.github.releaseTag)) {
          url += 'v1.2.0'
        }
        if (url.startsWith(externalLinksModule.ipfs.proxyPrefix)) {
          url += 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m'
        }

        it.concurrent(
          `${linksGroupName} ${linkName} ${url}`,
          {
            retry: 3,
          },
          async () => {
            const response = await nodeFetch(url, { method: 'GET' })
            expect(response.status).toBe(200)
          },
        )
      }
    }
  })
})

describe('links in named-addresses', () => {
  describe('should be reachable', () => {
    for (const json_url of [
      externalLinksModule.api.oasis_named_addresses_mainnet_consensus,
      externalLinksModule.api.oasis_named_addresses_mainnet_emerald,
      externalLinksModule.api.oasis_named_addresses_mainnet_sapphire,
      externalLinksModule.api.oasis_named_addresses_testnet_consensus,
      externalLinksModule.api.oasis_named_addresses_testnet_emerald,
      externalLinksModule.api.oasis_named_addresses_testnet_sapphire,
      externalLinksModule.api.oasis_named_addresses_testnet_pontusxdev,
      externalLinksModule.api.oasis_named_addresses_testnet_pontusxtest,
    ]) {
      it.concurrent(json_url, async () => {
        const metadataList = await (await nodeFetch(json_url, { method: 'GET' })).json()
        for (const metadata of metadataList) {
          if (metadata.Icon) {
            const { url, status, statusText } = await nodeFetch(metadata.Icon, { method: 'GET' })
            expect({ url, status, statusText }).toEqual(expect.objectContaining({ status: 200 }))
          }
          if (metadata.Dapp?.Url) {
            const { url, status, statusText } = await nodeFetch(metadata.Dapp?.Url, { method: 'GET' })
            expect({ url, status, statusText }).toEqual(expect.objectContaining({ status: 200 }))
          }
        }
      })
    }
  })
})
