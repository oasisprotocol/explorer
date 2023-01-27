import { LineChart as RechartsLineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { Margin } from 'recharts/types/util/types'
import { COLORS } from '../../../styles/theme/colors'
import { memo, ReactElement } from 'react'
import { Formatters, TooltipContent } from './Tooltip'

interface LineChartProps<T extends object> extends Formatters {
  data: T[]
  dataKey: keyof T
  margin?: Margin
  strokeWidth?: number | string
}

const LineChartCmp = <T extends object>({
  data,
  margin,
  strokeWidth = 2,
  dataKey,
  formatters,
}: LineChartProps<T>): ReactElement => (
  <ResponsiveContainer width="100%" aspect={4}>
    <RechartsLineChart data={data} margin={margin}>
      <Line
        type="monotone"
        dataKey={dataKey as string}
        stroke={COLORS.brandDark}
        strokeWidth={strokeWidth}
        dot={false}
        activeDot={{ r: 5, fill: COLORS.brandExtraDark, strokeWidth: 20, stroke: '#0000621A' }}
      />
      <YAxis domain={['dataMin', 'dataMax']} axisLine={false} tickLine={false} tick={false} mirror={true} />
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
