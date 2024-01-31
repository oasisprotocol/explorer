import { redactURL } from './redact'

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
window._paq.push(['setSiteId', '3'])

window._paq.push([
  'setCustomRequestProcessing',
  (queryString: string) => {
    const params = new URLSearchParams(queryString)
    for (const name of ['action_name', 'url', 'urlref']) {
      const v = params.get(name)
      if (v) {
        params.set(name, redactURL(v))
      }
    }

    return params.toString()
  },
])

const d = document,
  g = d.createElement('script'),
  s = d.getElementsByTagName('script')[0]
g.async = true
// TODO:? g.integrity="sha384-...";
g.src = `${matomoDomain}matomo.js`
s.parentNode?.insertBefore(g, s)
