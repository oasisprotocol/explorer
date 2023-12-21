import { memo } from 'react'
import { ResponsiveContainer, Tooltip, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'
import { TooltipContent, type Formatters } from './Tooltip'
import { COLORS } from '../../../styles/theme/colors'
import { COLORS as TESTNET_COLORS } from '../../../styles/theme/testnet/colors'

interface PieChartProps<T extends object> extends Formatters {
  data: T[]
  dataKey: Extract<keyof T, string>
}

const colorPalette = [COLORS.brandDark, COLORS.brandMedium, TESTNET_COLORS.testnet, COLORS.grayMedium2]

const PieChartCmp = <T extends object>({ data, dataKey, formatters }: PieChartProps<T>) => {
  if (!data.length) {
    return null
  }
  const labelKey = Object.keys(data[0]).find(key => key !== dataKey)
  if (!labelKey) {
    throw new Error('Not able to determine label key')
  }

  return (
    <ResponsiveContainer width="100%">
      <RechartsPieChart width={100} height={100}>
        <Tooltip
          cursor={false}
          wrapperStyle={{ outline: 'none' }}
          content={<TooltipContent formatters={formatters} labelKey={labelKey} />}
          offset={15}
        />
        <Pie stroke="none" data={data} innerRadius={40} outerRadius={80} paddingAngle={0} dataKey={dataKey}>
          {data.map((item, index) => {
            const label = item[labelKey as keyof T] as string
            return <Cell key={`${label}-${index}`} fill={colorPalette[index % colorPalette.length]} />
          })}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export const PieChart = memo(PieChartCmp) as typeof PieChartCmp
