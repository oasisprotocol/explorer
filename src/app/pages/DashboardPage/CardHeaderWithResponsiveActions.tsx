import CardHeader from '@mui/material/CardHeader'
import { styled } from '@mui/material/styles'

export const CardHeaderWithResponsiveActions = styled(CardHeader)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    '.MuiCardHeader-action': {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
  },
  // https://github.com/mui/material-ui/issues/15759#issuecomment-493994852
})) as typeof CardHeader
