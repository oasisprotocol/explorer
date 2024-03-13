import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useScreenSize } from 'app/hooks/useScreensize'

export const AnalyticsDialogLayout = (props: {
  isOpen: boolean
  message: React.ReactNode
  actions: React.ReactNode
}) => {
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
              fontSize="14px"
              sx={{
                paddingBottom: '12px',
                lineHeight: '1.25',
              }}
              align="center"
            >
              {props.message}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', paddingBottom: isMobile ? '16px' : '32px' }}>
            {props.actions}
          </CardActions>
        </Card>
      </Snackbar>
    </>
  )
}
