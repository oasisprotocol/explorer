import { memo } from 'react'
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
import { Margin } from 'recharts/types/util/types'
import { useTranslation } from 'react-i18next'

interface BarChartProps<T extends object> extends Formatters {
  barSize?: number
  barRadius?: number
  cartesianGrid?: boolean
  data: T[]
  dataKey: Extract<keyof T, string>
  rounded?: boolean
  withBarBackground?: boolean
  withLabels?: boolean
  tickMark?: boolean
  margin?: Margin
}

const BarChartCmp = <T extends object>({
  barSize = 12,
  barRadius = 12,
  cartesianGrid,
  data,
  dataKey,
  formatters,
  rounded,
  withLabels,
  withBarBackground,
  tickMark,
  margin,
}: BarChartProps<T>) => {
  const { t } = useTranslation()

  return (
    <ResponsiveContainer width="100%">
      <RechartsBarChart data={data} margin={margin ?? { right: 8, bottom: 0, left: 8 }}>
        {cartesianGrid && <CartesianGrid vertical={false} stroke={COLORS.antiFlashWhite3} />}
        {withLabels && (
          <YAxis
            tick={{ fill: COLORS.brandDark, strokeWidth: 0 }}
            axisLine={false}
            tickLine={false}
            type="number"
            interval="preserveStartEnd"
            tickMargin={0}
            domain={([dataMin, dataMax]) => [0, Number((dataMax * 1.2).toPrecision(2))]}
            tickFormatter={tick => {
              return tickMark
                ? t('common.valuePair', {
                    value: tick,
                    formatParams: {
                      value: {
                        notation: 'compact',
                      } satisfies Intl.NumberFormatOptions,
                    },
                  })
                : tick
            }}
          />
        )}
        <Tooltip
          cursor={false}
          wrapperStyle={{ outline: 'none' }}
          content={<TooltipContent formatters={formatters} />}
          offset={15}
        />
        <Bar
          background={
            withBarBackground
              ? {
                  fill: COLORS.grayLight,
                  radius: 20,
                }
              : undefined
          }
          dataKey={dataKey}
          barSize={barSize}
          fill={COLORS.denimBlue}
          radius={rounded ? barRadius : [barRadius, barRadius, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export const BarChart = memo(BarChartCmp) as typeof BarChartCmp
