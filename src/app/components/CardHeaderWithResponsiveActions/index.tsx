import CardHeader, { cardHeaderClasses } from '@mui/material/CardHeader'
import { styled } from '@mui/material/styles'

export const CardHeaderWithResponsiveActions = styled(CardHeader)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'inline',
    alignItems: 'flex-start',
    flexDirection: 'column',
    [`.${cardHeaderClasses.content}`]: {
      display: 'inline',
      marginRight: theme.spacing(4),
    },
    [`.${cardHeaderClasses.action}`]: {
      display: 'inline',
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
  },
  // https://github.com/mui/material-ui/issues/15759#issuecomment-493994852
})) as typeof CardHeader
