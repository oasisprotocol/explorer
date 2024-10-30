import { TooltipProps } from 'recharts'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

export const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  padding: theme.spacing(3, 5),
  background: COLORS.spaceCadet,
  boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
  borderRadius: '8px',
  color: COLORS.white,
  textAlign: 'center',
}))

export type Formatters = {
  formatters?: {
    data?: (value: number, payload?: { [key: string]: string | number }) => string
    label?: (value: string) => string
  }
}

type TooltipContentProps = TooltipProps<number, string> &
  Formatters & {
    labelKey?: string
  }

export const TooltipContent = ({
  active,
  payload,
  formatters,
  labelKey: dataLabelKey,
}: TooltipContentProps) => {
  if (!active || !payload || !payload.length) {
    return null
  }
  const { [payload[0].dataKey!]: value, ...rest } = payload[0].payload
  const labelKey = dataLabelKey || Object.keys(rest)[0]

  return (
    <StyledPaper>
      <Typography paragraph={false} sx={{ fontSize: 12 }}>
        {formatters?.label ? formatters.label(payload[0].payload[labelKey]) : payload[0].payload[labelKey]}
      </Typography>
      <Typography paragraph={false} sx={{ fontSize: 12, fontWeight: 600 }}>
        {formatters?.data ? formatters.data(payload[0].value!, payload[0].payload.payload) : payload[0].value}
      </Typography>
    </StyledPaper>
  )
}
