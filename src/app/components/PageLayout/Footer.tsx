import { AppTypography } from '../AppTypography/AppTypography'
import { AppBox } from '../AppBox/AppBox'

export function Footer() {
  return (
    <footer>
      <AppBox sx={{ display: 'flex', justifyContent: 'space-between', p: 6 }}>
        <AppTypography variant="footer">Version: {process.env.REACT_APP_BUILD_SHA}</AppTypography>
        <AppTypography variant="footer">Oasis Protocol Foundation | 2022</AppTypography>
      </AppBox>
    </footer>
  )
}
