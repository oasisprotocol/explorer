import { Fragment, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'

const CookieConsent = () => {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  const AcceptCookiesButton = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '47px',
    borderRadius: '46px',
    backgroundColor: COLORS.brandMedium,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    color: 'white',
    fontWeight: '400',
    marginRight: '0',
    marginBottom: '16px',
    [theme.breakpoints.up('sm')]: {
      width: '126px',
      marginRight: '8px',
      marginBottom: '0',
    },
  }))

  const DeclineCookiesButton = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '47px',
    borderRadius: '46px',
    backgroundColor: COLORS.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    color: COLORS.graphLabel,
    fontWeight: '400',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: COLORS.graphLabel,
    [theme.breakpoints.up('sm')]: {
      width: '126px',
      marginLeft: '8px',
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
        <Fragment>
          <AcceptCookiesButton onClick={handleClose}>Accept</AcceptCookiesButton>
          <DeclineCookiesButton onClick={handleClose}>Decline</DeclineCookiesButton>
        </Fragment>
      }
    />
  )
}

export default CookieConsent
