import {
  LineChart as RechartsLineChart,
  Line,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { Margin } from 'recharts/types/util/types'
import { COLORS } from '../../../styles/theme/colors'
import { memo, ReactElement } from 'react'
import { Formatters, TooltipContent } from './Tooltip'
import ActiveDotIcon from '../../icons/ActiveDotIcon'


interface LineChartProps<T extends object> extends Formatters {
  data: T[];

  dataKey: keyof T;
  margin?: Margin;
  strokeWidth?: number | string;
}
const LineChartCmp = <T extends object>({ data, margin, strokeWidth = 1, dataKey, formatters }: LineChartProps<T>): ReactElement => (
  <ResponsiveContainer width="100%" aspect={4}>
    <RechartsLineChart
      data={data}
      margin={margin}
    >
      <Line
        type="monotone"
        dataKey={dataKey as string}
        stroke={COLORS.brandExtraDark}
        strokeWidth={strokeWidth}
        dot={false}
        activeDot={<ActiveDotIcon />}
      />
      <Tooltip
        cursor={false}
        wrapperStyle={{ outline: 'none' }}
        content={<TooltipContent formatters={formatters} />}
        offset={15}
      />
    </RechartsLineChart>
  </ResponsiveContainer>
);

export const LineChart = memo(LineChartCmp) as typeof LineChartCmp;
