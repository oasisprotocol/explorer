import {
  LineChart as RechartsLineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { Margin } from 'recharts/types/util/types'
import { COLORS } from '../../../styles/theme/colors'
import { memo } from 'react'

export interface LineChartDataPoint {
  label: string;
  value: string | number;
}

interface LineChartProps {
  data: LineChartDataPoint[];
  margin?: Margin;
  strokeWidth?: number | string;
}
const LineChart: React.FC<LineChartProps> = ({ data, margin, strokeWidth = 1 }) => (
  <ResponsiveContainer width="100%" aspect={4}>
    <RechartsLineChart
      data={data}
      margin={margin}
    >
      <Line
        type="monotone"
        dataKey="value"
        stroke={COLORS.navyBlueExtraDark}
        strokeWidth={strokeWidth}
        dot={false}
      />
      {/*TODO: Tooltip & dot*/}
    </RechartsLineChart>
  </ResponsiveContainer>
);

export default memo(LineChart);
