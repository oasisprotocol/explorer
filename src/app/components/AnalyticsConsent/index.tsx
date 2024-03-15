import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import { Trans, useTranslation } from 'react-i18next'
import * as matomo from './initializeMatomo'
import { legalDocuments } from '../../utils/externalLinks'


const localStore = storage()

export const AnalyticsConsent = () => {
  const [open, setOpen] = useState(localStore.get(StorageKeys.AnalyticsConsentOpen) ?? true)
  const [optedIn, setOptedIn] = useState(localStore.get(StorageKeys.AnalyticsOptedIn) ?? false)

  useEffect(() => {
    if (optedIn) {
      matomo.addMatomo()
      // Warning: There's no cleanup for this.
      // Matomo docs give no advice for SPAs.
      // https://developer.matomo.org/guides/tracking-consent#b-if-you-use-your-own-consent-tool-to-remember-the-consent
      // We currently don't have any in-app UI to revisit the consent.
      // If we add one, we have to reload the page to be without the analytics
      // library.
    }
  }, [optedIn])

  const location = useLocation()
  const [previousURL, setPreviousURL] = useState(document.referrer)
  useEffect(() => {
    const newURL = location.pathname + location.search + location.hash
    if (optedIn) {
      // Adjusted snippet from https://developer.matomo.org/guides/spa-tracking#measuring-single-page-apps-complete-example
      window._paq.push(['setReferrerUrl', previousURL])
      window._paq.push(['setCustomUrl', newURL])
      window._paq.push(['setDocumentTitle', document.title])
      window._paq.push(['trackPageView'])
      window._paq.push(['enableLinkTracking'])
    }
    setPreviousURL(newURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Trigger when URL changes
  }, [location.key, optedIn])

  const handleClose = (accepted: boolean) => {
    localStore.set(StorageKeys.AnalyticsConsentOpen, false)
    localStore.set(StorageKeys.AnalyticsOptedIn, accepted)
    setOpen(false)
    setOptedIn(accepted)
  }

  return (
    <AnalyticsConsentView
      isOpen={open}
      onAccept={() => handleClose(true)}
      onDecline={() => handleClose(false)}
    />
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
