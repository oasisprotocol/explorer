import { AccountLink } from './AccountLink'
import { withAddressSwitch } from './withAddressSwitch'
import Box from '@mui/material/Box'

export const AccountLinkWithAddressSwitch = withAddressSwitch(AccountLink)

export const WrappedAccountLinkWithAddressSwitch: typeof AccountLinkWithAddressSwitch = props => (
  <Box
    sx={{
      display: 'inline-flex',
      maxWidth: '100%',
      paddingRight: '0.5em',
    }}
  >
    <AccountLinkWithAddressSwitch {...props} />
  </Box>
)
