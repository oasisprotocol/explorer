import { FC } from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { TooltipContent, type Formatters } from './Tooltip'
import { COLORS } from '../../../styles/theme/colors'

export type BarChartProps = Formatters & {
  data: any[]
  dataKey: string
}

export const BarChart: FC<BarChartProps> = ({ data, dataKey, formatters }) => (
  <ResponsiveContainer width="100%" aspect={4}>
    <RechartsBarChart data={data} margin={{ right: 0, bottom: 0 }}>
      <CartesianGrid vertical={false} stroke={COLORS.antiFlashWhite3} />
      <YAxis
        tick={{ fill: COLORS.brandDark, strokeWidth: 0, fontWeight: 600 }}
        axisLine={false}
        tickLine={false}
        type="number"
        padding={{ bottom: 20 }}
        tickMargin={0}
      />
      <Tooltip
        cursor={false}
        wrapperStyle={{ outline: 'none' }}
        content={<TooltipContent formatters={formatters} />}
        offset={15}
      />
      <Bar dataKey={dataKey} barSize={12} fill={COLORS.denimBlue} radius={[10, 10, 0, 0]} />
    </RechartsBarChart>
  </ResponsiveContainer>
)
