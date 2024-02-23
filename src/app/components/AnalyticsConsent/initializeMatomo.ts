/// <reference types="matomo-js-client-types" />

// Generate snippet https://matomo.oasis.io/index.php?module=CoreAdminHome&action=trackingCodeGenerator&idSite=1&period=day&date=yesterday&updated=false
// Snippet from https://developer.matomo.org/guides/tracking-javascript-guide#finding-the-piwik-tracking-code
window._paq = window._paq || []
export const matomoDomain = 'https://matomo.oasis.io/'
window._paq.push(['setSiteId', '3'])
window._paq.push(['setDoNotTrack', true])
window._paq.push(['enableLinkTracking'])
window._paq.push(['setTrackerUrl', `${matomoDomain}matomo.php`])

// https://developer.matomo.org/guides/tracking-javascript-guide#tracking-one-domain-and-its-subdomains-in-the-same-website
// https://matomo.org/faq/how-to/faq_23654/
// window._paq.push(['setDomains', ['*.domain1.com', '*.domain2.com']])
// window._paq.push(['enableCrossDomainLinking'])
// window._paq.push(['setCookieDomain', '*.example.org'])

export function loadMatomo() {
  const d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0]
  g.async = true
  // TODO: Enable SRI and fix CORS on matomo.js to support SRI.
  // Warning: https://github.com/matomo-org/matomo/commits/5.x-dev/js/piwik.min.js
  // changed 5 times between 2023 Feb and 2024 Jan.
  // g.integrity = 'sha384-yGkhmoBpWPCg9IZSGIz64itCivgzaXu+CXflD1GthTMPW3YUjF4FoJ8YUBGDTOF7'
  g.src = `${matomoDomain}matomo.js`
  s.parentNode?.insertBefore(g, s)
}
