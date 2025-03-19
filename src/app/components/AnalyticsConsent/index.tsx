/* eslint-disable react-hooks/rules-of-hooks -- REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS won't change in runtime */
import { createContext, FC, useContext, useEffect, useState } from 'react'
import { useBlocker, useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import { Trans, useTranslation } from 'react-i18next'
import * as matomo from './initializeMatomo'
import { ThemeByScope } from '../ThemeByScope'
import { Network } from '../../../types/network'
import { AnalyticsIsBlocked } from './AnalyticsIsBlocked'
import { AnalyticsDialogLayout } from './AnalyticsDialogLayout'

const AnalyticsContext = createContext<{
  reopenAnalyticsConsent: () => void
} | null>(null)

export const AnalyticsConsentProvider = (props: { children: React.ReactNode }) => {
  if (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS !== 'true') return <>{props.children}</>

  const [hasAccepted, setHasAccepted] = useState<
    matomo.HasAccepted | 'loading' | 'timed_out_matomo_not_loaded_force_open'
  >('loading')

  useEffect(() => {
    matomo.addMatomo()
  }, [])

  useEffect(() => {
    const setInitialHasAccepted = async () => {
      setHasAccepted(await matomo.hasAccepted({ timeout: 10_000 }))
    }
    setInitialHasAccepted()
  }, [])

  const location = useLocation()
  const [previousURL, setPreviousURL] = useState(document.referrer)
  useBlocker(({ currentLocation, nextLocation }) => {
    setPreviousURL(currentLocation.pathname + currentLocation.search + currentLocation.hash)
    return false // Not actually using this to block navigation
  })
  useEffect(() => {
    const newURL = location.pathname + location.search + location.hash
    if (hasAccepted === 'opted-in') {
      // Adjusted snippet from https://developer.matomo.org/guides/spa-tracking#measuring-single-page-apps-complete-example
      window._paq.push(['setReferrerUrl', previousURL])
      window._paq.push(['setCustomUrl', newURL])
      window._paq.push(['setDocumentTitle', document.title])
      window._paq.push(['trackPageView'])
      window._paq.push(['enableLinkTracking'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Trigger on init, when URL changes, or opt-in clicked
  }, [location.key, hasAccepted])

  return (
    <AnalyticsContext.Provider
      value={{
        reopenAnalyticsConsent: () => {
          if (hasAccepted === 'timed_out_matomo_not_loaded' || hasAccepted === 'loading') {
            setHasAccepted('timed_out_matomo_not_loaded_force_open')
          } else {
            setHasAccepted('not-chosen')
          }
        },
      }}
    >
      {props.children}
      {/* Theme is needed because AnalyticsConsentProvider is outside network-themed routes */}
      <ThemeByScope isRootTheme={false} network={Network.mainnet}>
        <AnalyticsConsentView
          isOpen={hasAccepted === 'not-chosen'}
          onAccept={async () => {
            matomo.optInForOneYear()
            setHasAccepted(await matomo.hasAccepted({ timeout: 10_000 }))
          }}
          onDecline={async () => {
            matomo.decline()
            setHasAccepted(await matomo.hasAccepted({ timeout: 10_000 }))
          }}
        />
        <AnalyticsIsBlocked
          isOpen={hasAccepted === 'timed_out_matomo_not_loaded_force_open'}
          onReload={() => window.location.reload()}
          onClose={() => setHasAccepted('timed_out_matomo_not_loaded')}
        />
      </ThemeByScope>
    </AnalyticsContext.Provider>
  )
}

const StyledPrivacyButton = styled(Button)(() => ({
  padding: 0,
  textAlign: 'left',
  height: 'auto',
  fontSize: 'inherit',
  fontWeight: 700,
}))

export const PrivacyPolicyFooterLink: FC = () => {
  const { t } = useTranslation()
  return (
    <Link href={process.env.REACT_APP_PRIVACY_POLICY} target="_blank" color="inherit">
      {t('analyticsConsent.privacyPolicy')}
    </Link>
  )
}

export const ReopenAnalyticsConsentButton = () => {
  if (window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS !== 'true') return <PrivacyPolicyFooterLink />

  const { t } = useTranslation()
  const context = useContext(AnalyticsContext)
  if (context === null) throw new Error('must be used within AnalyticsContext')
  return (
    <StyledPrivacyButton size="small" color="inherit" onClick={() => context.reopenAnalyticsConsent()}>
      {t('analyticsConsent.settings')}
    </StyledPrivacyButton>
  )
}

const StyledButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export const AnalyticsConsentView = (props: {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}) => {
  const { t } = useTranslation()
  return (
    <AnalyticsDialogLayout
      isOpen={props.isOpen}
      message={
        <Trans
          i18nKey="analyticsConsent.text"
          t={t}
          components={{
            PrivacyPolicyLink: (
              <Link
                href={process.env.REACT_APP_PRIVACY_POLICY}
                target="_blank"
                sx={{ fontWeight: 400, textDecoration: 'underline' }}
              />
            ),
          }}
          values={{ acceptButtonLabel: t('analyticsConsent.acceptButtonLabel') }}
        />
      }
      actions={
        <>
          <StyledButton onClick={() => props.onAccept()} color="primary" variant="contained">
            {t('analyticsConsent.acceptButtonLabel')}
          </StyledButton>
          <StyledButton onClick={() => props.onDecline()} color="secondary" variant="outlined">
            {t('analyticsConsent.declineButtonLabel')}
          </StyledButton>
        </>
      }
    />
  )
}
