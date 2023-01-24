import nodeFetch from 'node-fetch'
import * as externalLinksModule from '../externalLinks'

jest.setTimeout(30_000)
jest.retryTimes(3) // Reddit is unreliable

// Requesting external links is sometimes slow; and links will rarely break.
// So only run this on CI, so local tests remain quick.
const onlyRunOnCI = process.env.CI ? describe : describe.skip

onlyRunOnCI('externalLinks', () => {
  it('file should contain groups of links as objects', () => {
    expect(Object.entries(externalLinksModule).length).toBeGreaterThan(0)
    for (const [linksGroupName, linksGroup] of Object.entries(externalLinksModule)) {
      expect(Object.entries(linksGroup).length).toBeGreaterThan(0)
      for (const [linkName, url] of Object.entries(linksGroup)) {
        expect(url).toMatch(/^https:/)
      }
    }
  })

  describe('should be reachable', () => {
    for (const [linksGroupName, linksGroup] of Object.entries(externalLinksModule)) {
      for (const [linkName, url] of Object.entries(linksGroup)) {
        it(`${linksGroupName} ${linkName} ${url}`, async () => {
          const response = await nodeFetch(url, { method: 'HEAD' })
          expect(response.status).toBe(200)
        })
      }
    }
  })
})
