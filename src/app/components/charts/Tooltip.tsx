import { TooltipProps } from 'recharts'
import Typography from '@mui/material/Typography'
import { COLORS } from 'styles/theme/colors'

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
    <div
      className="inline-flex flex-col px-5 py-3 shadow-lg rounded-lg text-white text-center"
      style={{ backgroundColor: COLORS.spaceCadet }}
    >
      <Typography paragraph={false} sx={{ fontSize: 12 }}>
        {formatters?.label ? formatters.label(payload[0].payload[labelKey]) : payload[0].payload[labelKey]}
      </Typography>
      <Typography paragraph={false} sx={{ fontSize: 12, fontWeight: 600 }}>
        {formatters?.data ? formatters.data(payload[0].value!, payload[0].payload.payload) : payload[0].value}
      </Typography>
    </div>
  )
}
