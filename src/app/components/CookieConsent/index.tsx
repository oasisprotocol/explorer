import { useState } from 'react'
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

const CookieConsent = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)
  const { isMobile } = useScreenSize()

  const handleClose = () => {
    setOpen(false)
  }

  const AcceptCookiesButton = styled(Button)(({ theme }) => ({
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  }))

  const DeclineCookiesButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  }))

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
      <Card>
        <CardContent>
          <Typography
            sx={{
              paddingBottom: '12px',
              textAlign: 'center',
              lineHeight: '1.25',
            }}
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

export default CookieConsent
