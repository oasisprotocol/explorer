import {
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts'
import { Margin } from 'recharts/types/util/types'
import { COLORS } from '../../../styles/theme/colors'
import { memo, ReactElement } from 'react'
import { Formatters, TooltipContent } from './Tooltip'
import { useTranslation } from 'react-i18next'

interface LineChartProps<T extends object> extends Formatters {
  cartesianGrid?: boolean
  data: T[]
  dataKey: Extract<keyof T, string>
  margin?: Margin
  strokeWidth?: number | string
  tickMargin?: number
  tooltipActiveDotRadius?: number
  withLabels?: boolean
  maximumFractionDigits?: number
  alignDomainToDataPoints?: boolean
}

const LineChartCmp = <T extends object>({
  cartesianGrid,
  data,
  dataKey,
  formatters,
  margin,
  strokeWidth = 2,
  tickMargin = 0,
  tooltipActiveDotRadius = 5,
  withLabels,
  maximumFractionDigits = 0,
  alignDomainToDataPoints,
}: LineChartProps<T>): ReactElement => {
  const { t } = useTranslation()

  return (
    <ResponsiveContainer width="100%">
      <RechartsLineChart data={data} margin={margin}>
        {cartesianGrid && <CartesianGrid vertical={false} stroke={COLORS.antiFlashWhite3} />}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={COLORS.brandDark}
          strokeWidth={strokeWidth}
          dot={false}
          activeDot={{
            r: tooltipActiveDotRadius,
            fill: COLORS.brandDark,
            strokeWidth: tooltipActiveDotRadius * 4,
            stroke: '#0000621A',
          }}
        />
        <YAxis
          domain={!alignDomainToDataPoints && withLabels ? [0, 'auto'] : ['dataMin', 'dataMax']}
          axisLine={false}
          interval={0}
          tickLine={false}
          mirror={!withLabels}
          tick={withLabels ? { fill: COLORS.brandDark, strokeWidth: 0 } : false}
          type="number"
          tickMargin={tickMargin}
          tickFormatter={tick =>
            t('common.valuePair', {
              value: tick,
              formatParams: {
                value: {
                  notation: 'compact',
                  maximumFractionDigits,
                } satisfies Intl.NumberFormatOptions,
              },
            })
          }
        />
        <Tooltip
          cursor={false}
          wrapperStyle={{ outline: 'none' }}
          content={<TooltipContent formatters={formatters} />}
          offset={15}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export const LineChart = memo(LineChartCmp) as typeof LineChartCmp
