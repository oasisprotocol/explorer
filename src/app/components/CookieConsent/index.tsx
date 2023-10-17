import { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import Button from '@mui/material/Button'

const CookieConsent = () => {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  const AcceptCookiesButton = styled(Button)(({ theme }) => ({
    marginRight: '8px',
    // [theme.breakpoints.up('sm')]: {
    //   width: '126px',
    // },
    padding: '12px',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  }))

  const DeclineCookiesButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    marginLeft: '8px',

    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },

    // [theme.breakpoints.up('sm')]: {
    //   width: '126px',
    // },
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
        '& .MuiPaper-elevation': {
          backgroundColor: COLORS.white,
          borderRadius: '12px',
        },
        '& .MuiSnackbarContent-action': {
          margin: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '21px',
          flexWrap: 'wrap',
          paddingLeft: '0',
        },
        '& .MuiTypography-root a': {
          color: COLORS.graphLabel,
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
          At Oasis Foundation we believe in your privacy, so you can choose to browse our site without any
          tracking or by clicking “Accept”, you help us to improve our site and help us grow our ecosystem.
          View our{' '}
          <a href="https://oasisprotocol.org/privacy-policy" target="_blank">
            Privacy Policy
          </a>{' '}
          for more information.{' '}
        </Typography>
      }
      action={
        <>
          <AcceptCookiesButton onClick={handleClose} color="primary" variant="contained">
            Accept
          </AcceptCookiesButton>
          <DeclineCookiesButton onClick={handleClose} color="secondary" variant="outlined">
            Decline
          </DeclineCookiesButton>
        </>
      }
    />
  )
}

export default CookieConsent
