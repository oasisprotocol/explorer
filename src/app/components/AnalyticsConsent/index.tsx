import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import { Trans, useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useScreenSize } from 'app/hooks/useScreensize'
import * as matomo from './initializeMatomo'
import { legalDocuments } from '../../utils/externalLinks'

export const AnalyticsConsent = () => {
  const { t } = useTranslation()
  const [hasAccepted, setHasAccepted] = useState<matomo.HasAccepted>('timed_out_matomo_not_loaded')

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
    <>
      <Button size="small" color="inherit" onClick={() => setHasAccepted('not-chosen')}>
        {t('analyticsConsent.settings')}
      </Button>
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
    </>
  )
}

const AcceptCookiesButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

const DeclineCookiesButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export const AnalyticsConsentView = (props: {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          maxWidth: '450px',
        }}
        open={props.isOpen}
      >
        <Card elevation={4}>
          <CardContent>
            <Typography
              sx={{
                paddingBottom: '12px',
                lineHeight: '1.25',
              }}
              align="center"
            >
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
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', paddingBottom: isMobile ? '16px' : '32px' }}>
            <AcceptCookiesButton onClick={() => props.onAccept()} color="primary" variant="contained">
              {t('analyticsConsent.acceptButtonLabel')}
            </AcceptCookiesButton>
            <DeclineCookiesButton onClick={() => props.onDecline()} color="secondary" variant="outlined">
              {t('analyticsConsent.declineButtonLabel')}
            </DeclineCookiesButton>
          </CardActions>
        </Card>
      </Snackbar>
    </>
  )
}
