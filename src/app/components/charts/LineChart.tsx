import {
  LineChart as RechartsLineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { Margin } from 'recharts/types/util/types'

// TODO: Consolidate colors
const colors = {
  navyBlueExtraDark: '#000062'
}

export interface LineChartDataPoint {
  label: string;
  value: string | number;
}

interface LineChartProps {
  data: LineChartDataPoint[];
  margin?: Margin;
}
export const LineChart: React.FC<LineChartProps> = ({ data, margin }) => (
  <ResponsiveContainer width="100%" aspect={4}>
    <RechartsLineChart
      data={data}
      margin={margin}
    >
      <Line
        type="monotone"
        dataKey="value"
        stroke={colors.navyBlueExtraDark}
        strokeWidth={1.09}
        dot={false}
      />
    </RechartsLineChart>
  </ResponsiveContainer>
);
