import { TooltipProps } from 'recharts'

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
    <div className="inline-flex flex-col rounded-md px-3 py-1.5 text-pretty bg-popover border text-popover-foreground text-sm shadow-md">
      <span>
        {formatters?.label ? formatters.label(payload[0].payload[labelKey]) : payload[0].payload[labelKey]}
      </span>
      <span className="font-semibold">
        {formatters?.data ? formatters.data(payload[0].value!, payload[0].payload.payload) : payload[0].value}
      </span>
    </div>
  )
}
