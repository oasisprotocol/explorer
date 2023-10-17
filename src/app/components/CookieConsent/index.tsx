import { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Trans, useTranslation } from 'react-i18next'

const CookieConsent = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  const AcceptCookiesButton = styled(Button)(({ theme }) => ({
    padding: '12px',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  }))

  const DeclineCookiesButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  }))

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      sx={{
        maxWidth: '450px',
        height: 'auto',
        fontSize: '14px',
        borderRadius: '12px',
        lineHeight: '1.25',
        backgroundColor: COLORS.white,
        // '& .MuiPaper-elevation': {
        //   backgroundColor: COLORS.white,
        //   borderRadius: '12px',
        // },
        '& .MuiSnackbarContent-action': {
          margin: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '21px',
          flexWrap: 'wrap',
          paddingLeft: '0',
        },
      }}
      open={open}
      message={
        <Typography
          sx={{
            paddingTop: '15px',
            paddingBottom: '12px',
            paddingLeft: '3px',
            paddingRight: '3px',
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
      }
      action={
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <AcceptCookiesButton onClick={handleClose} color="primary" variant="contained">
            {t('analyticsConsent.acceptButtonLabel')}
          </AcceptCookiesButton>
          <DeclineCookiesButton onClick={handleClose} color="secondary" variant="outlined">
            {t('analyticsConsent.declineButtonLabel')}
          </DeclineCookiesButton>
        </Box>
      }
    />
  )
}

export default CookieConsent
