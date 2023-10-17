declare global {
  interface Window {
    _paq: [string, ...any[]][]
  }
}

// Generate snippet https://matomo.oasis.io/index.php?module=CoreAdminHome&action=trackingCodeGenerator&idSite=1&period=day&date=yesterday&updated=false
// Snippet from https://developer.matomo.org/guides/tracking-javascript-guide#finding-the-piwik-tracking-code
window._paq = window._paq || []
export const matomoDomain = 'https://matomo.oasis.io/'
// https://matomo.org/faq/how-to/faq_23654/
window._paq.push(['setDomains', ['*.domain1.com', '*.domain2.com']])
window._paq.push(['enableCrossDomainLinking'])
/* tracker methods like 'setCustomDimension' should be called before 'trackPageView' */
window._paq.push(['setCookieDomain', '*.example.org'])
window._paq.push(['setDoNotTrack', true])
window._paq.push(['enableLinkTracking'])
window._paq.push(['setTrackerUrl', `${matomoDomain}matomo.php`])
window._paq.push(['setSiteId', '1'])

window._paq.push([
  'setCustomRequestProcessing',
  (queryString: string) => {
    // TODO: Anonymize
    const params = new URLSearchParams(queryString)
    // params.get('action_name')
    // params.get('url')
    // params.get('urlref')

    // https://explorer.dev.oasis.io/mainnet/emerald/tx/0xf0f08f00150f5d4273c0cf07f36ee7545e5e130e477a8528271379ce3628e104
    // https://explorer.dev.oasis.io/mainnet/sapphire/address/0xEd03EA9c96ec39097548256E428a163E5f524e47/tokens/erc-721#0xFcfed3be2d333F24854cA8d3A351E772272D5842
    // .replaceAll(/0x[a-f0-9]+/ig, '0x...')
    // https://explorer.dev.oasis.io/mainnet/emerald/address/oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t
    // https://explorer.dev.oasis.io/search?q=oasis1qrvha284gfztn7wwq6z50c86ceu28jp7csqhpx9t
    // .replaceAll(/oasis1[a-z0-9]+/ig, 'oasis1...')
    // https://explorer.dev.oasis.io/mainnet/emerald/tx/aa5a562c714c9a4e8ecd88230757bc60f66765e56bd4645e11198457b8b278dd
    // .replaceAll TODO
    // https://explorer.dev.oasis.io/search?q=test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20test%20key
    // .replaceAll TODO

    return params.toString()
  },
])

const d = document,
  g = d.createElement('script'),
  s = d.getElementsByTagName('script')[0]
g.async = true
g.src = `${matomoDomain}matomo.js`
s.parentNode?.insertBefore(g, s)
