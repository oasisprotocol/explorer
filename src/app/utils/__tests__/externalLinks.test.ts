import nodeFetch from 'node-fetch'
import * as externalLinksModule from '../externalLinks'

jest.setTimeout(30_000)
jest.retryTimes(3)

// Requesting external links is sometimes slow; and links will rarely break.
// So only run this on CI, so local tests remain quick.
const onlyRunOnCI = process.env.CI ? describe : describe.skip

onlyRunOnCI('externalLinks', () => {
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
      for (const [linkName, url] of Object.entries(linksGroup)) {
        if (!url || typeof url !== 'string') continue
        if (!!reddit && url.startsWith(reddit)) continue // Reddit often returns 504
        if (!!twitter && url.startsWith(twitter)) continue // redirect loop
        if (url.startsWith(externalLinksModule.referrals.coinGecko)) continue // CoinGecko has CloudFlare DDOS protection
        if (url.startsWith(externalLinksModule.github.commit)) continue // We store only partial url in constants
        if (url.startsWith(externalLinksModule.github.releaseTag)) continue // We store only partial url in constants
        if (url.startsWith(externalLinksModule.ipfs.proxyPrefix)) continue // We store only partial url in constants
        if (url.startsWith(externalLinksModule.faucets.oasisTestnet)) continue // Has an interactive challenge
        if (url.startsWith('mailto')) continue // We can't test email addresses

        it.concurrent(`${linksGroupName} ${linkName} ${url}`, async () => {
          const response = await nodeFetch(url, { method: 'GET' })
          expect(response.status).toBe(200)
        })
      }
    }
  })
})
