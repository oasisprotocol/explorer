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
import { legalDocuments } from '../../utils/externalLinks'

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
