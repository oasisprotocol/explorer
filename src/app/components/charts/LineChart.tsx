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

interface LineChartProps<T extends object> extends Formatters {
  cartesianGrid?: boolean
  data: T[]
  dataKey: Extract<keyof T, string>
  margin?: Margin
  strokeWidth?: number | string
  tickMargin?: number
  tooltipActiveDotRadius?: number
  withLabels?: boolean
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
}: LineChartProps<T>): ReactElement => (
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
        domain={withLabels ? [0, 'auto'] : ['dataMin', 'dataMax']}
        axisLine={false}
        tickLine={false}
        mirror={!withLabels}
        tick={withLabels ? { fill: COLORS.brandDark, strokeWidth: 0 } : false}
        type="number"
        tickMargin={tickMargin}
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

export const LineChart = memo(LineChartCmp) as typeof LineChartCmp
