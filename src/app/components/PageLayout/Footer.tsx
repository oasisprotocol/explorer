import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function Footer() {
  return (
    <footer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 6 }}>
        <Typography variant="footer">Version: {process.env.REACT_APP_BUILD_SHA}</Typography>
        <Typography variant="footer">Oasis Protocol Foundation | 2022</Typography>
      </Box>
    </footer>
  )
}
