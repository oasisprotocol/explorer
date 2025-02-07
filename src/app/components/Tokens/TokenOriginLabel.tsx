import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

type TokenOriginLabelProps = {
  label?: string
}

export const TokenOriginLabel: FC<TokenOriginLabelProps> = ({ label }) => {
  if (!label) {
    return null
  }
  return <Typography sx={{ fontWeight: 400, color: COLORS.grayMedium }}>({label})</Typography>
}
