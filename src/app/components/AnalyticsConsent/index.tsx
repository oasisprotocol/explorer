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
import './initializeMatomo'

const AcceptCookiesButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

const DeclineCookiesButton = styled(Button)(({ theme }) => ({
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export const AnalyticsConsent = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)
  const { isMobile } = useScreenSize()

  const location = useLocation()
  const [previousURL, setPreviousURL] = useState(document.referrer)
  useEffect(() => {
    const newURL = location.pathname + location.search + location.hash
    // Adjusted snippet from https://developer.matomo.org/guides/spa-tracking#measuring-single-page-apps-complete-example
    window._paq.push(['setReferrerUrl', previousURL])
    window._paq.push(['setCustomUrl', newURL])
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['trackPageView'])
    window._paq.push(['enableLinkTracking'])
    setPreviousURL(newURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Trigger when URL changes
  }, [location.key])

  const handleClose = () => {
    // TODO https://developer.matomo.org/guides/tracking-javascript-guide#optional-creating-a-custom-opt-out-form
    setOpen(false)
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      sx={{
        maxWidth: '450px',
      }}
      open={open}
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
                    href="https://oasisprotocol.org/privacy-policy"
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
          <AcceptCookiesButton onClick={handleClose} color="primary" variant="contained">
            {t('analyticsConsent.acceptButtonLabel')}
          </AcceptCookiesButton>
          <DeclineCookiesButton onClick={handleClose} color="secondary" variant="outlined">
            {t('analyticsConsent.declineButtonLabel')}
          </DeclineCookiesButton>
        </CardActions>
      </Card>
    </Snackbar>
  )
}
