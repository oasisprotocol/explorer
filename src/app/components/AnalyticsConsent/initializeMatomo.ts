/// <reference types="matomo-js-client-types" />

import { redactURL } from './redact'

// Generate snippet https://matomo.oasis.io/index.php?module=CoreAdminHome&action=trackingCodeGenerator&idSite=1&period=day&date=yesterday&updated=false
// Snippet from https://developer.matomo.org/guides/tracking-javascript-guide#finding-the-piwik-tracking-code
window._paq = window._paq || []
export const matomoDomain = 'https://matomo.oasis.io/'
window._paq.push(['setSiteId', '3'])
// https://developer.matomo.org/guides/tracking-consent#step-1-require-consent
// https://matomo.org/faq/general/faq_156/
window._paq.push(['requireConsent'])
window._paq.push(['setDoNotTrack', true])
window._paq.push(['enableLinkTracking'])
window._paq.push(['setTrackerUrl', `${matomoDomain}matomo.php`])

// https://developer.matomo.org/guides/tracking-javascript-guide#tracking-one-domain-and-its-subdomains-in-the-same-website
// https://matomo.org/faq/how-to/faq_23654/
// window._paq.push(['setDomains', ['*.domain1.com', '*.domain2.com']])
// window._paq.push(['enableCrossDomainLinking'])
// window._paq.push(['setCookieDomain', '*.example.org'])

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

let addedMatomo = false
export function addMatomo() {
  if (addedMatomo) return
  addedMatomo = true
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

export function optInForOneYear() {
  // https://developer.matomo.org/guides/tracking-consent#a-if-you-want-to-let-matomo-remember-the-consent
  window._paq.push(['rememberConsentGiven', 365 * 24])
}

export function decline() {
  window._paq.push(['forgetConsentGiven'])
}

export type HasAccepted = 'opted-in' | 'declined' | 'not-chosen' | 'timed_out_matomo_not_loaded'
export async function hasAccepted({ timeout }: { timeout: number }): Promise<HasAccepted> {
  return await new Promise<HasAccepted>(resolve => {
    window._paq.push([
      function () {
        if (this.hasRememberedConsent()) {
          resolve('opted-in')
        } else {
          // Can not differentiate between declined and not-chosen without workaround
          // Based on https://github.com/matomo-org/matomo/blob/082782b/js/piwik.js#L7176-L7192
          // TODO: remove workaround after https://github.com/matomo-org/matomo/issues/17169 is solved
          const CONSENT_COOKIE_NAME = 'mtm_consent'
          const CONSENT_REMOVED_COOKIE_NAME = 'mtm_consent_removed'
          if (
            !getCookieWorkaround(CONSENT_COOKIE_NAME) &&
            !getCookieWorkaround(CONSENT_REMOVED_COOKIE_NAME)
          ) {
            resolve('not-chosen')
          } else {
            resolve('declined')
          }
        }
      },
    ])
    // If matomo doesn't load and process the queue within timeout then it was probably blocked by an extension.
    setTimeout(() => resolve('timed_out_matomo_not_loaded'), timeout)
  })
}

function getCookieWorkaround(cookieName: string) {
  const cookiePattern = new RegExp(`(^|;)[ ]*${cookieName}=([^;]*)`)
  const cookieMatch = cookiePattern.exec(document.cookie)
  return cookieMatch ? decodeURIComponent(cookieMatch[2]) : 0
}
