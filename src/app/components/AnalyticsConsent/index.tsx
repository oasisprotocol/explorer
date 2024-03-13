/* eslint-disable react-hooks/rules-of-hooks -- REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS can't change in runtime */
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import { Trans, useTranslation } from 'react-i18next'
import * as matomo from './initializeMatomo'
import { legalDocuments } from '../../utils/externalLinks'
import { ThemeByNetwork } from '../ThemeByNetwork'
import { Network } from '../../../types/network'
import { AnalyticsIsBlocked } from './AnalyticsIsBlocked'
import { AnalyticsDialogLayout } from './AnalyticsDialogLayout'

const AnalyticsContext = createContext<{
  reopenAnalyticsConsent: () => void
} | null>(null)

export const AnalyticsConsentProvider = (props: { children: React.ReactNode }) => {
  if (process.env.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS !== 'true') return <>{props.children}</>

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
    setPreviousURL(newURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Trigger when URL changes
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
      <ThemeByNetwork isRootTheme={false} network={Network.mainnet}>
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
      </ThemeByNetwork>
    </AnalyticsContext.Provider>
  )
}

export const ReopenAnalyticsConsentButton = () => {
  if (process.env.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS !== 'true') return <></>

  const { t } = useTranslation()
  const context = useContext(AnalyticsContext)
  if (context === null) throw new Error('must be used within AnalyticsContext')
  return (
    <Button size="small" color="inherit" onClick={() => context.reopenAnalyticsConsent()}>
      {t('analyticsConsent.settings')}
    </Button>
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
                href={legalDocuments.privacyPolicy}
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
