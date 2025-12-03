import { FC, memo, ReactNode, useState } from 'react'
import { Legend, ResponsiveContainer, Tooltip, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'
import { useTranslation } from 'react-i18next'
import { TooltipContent, type Formatters } from './Tooltip'
import { COLORS } from '../../../styles/theme/colors'
import { Props } from 'recharts/types/component/DefaultLegendContent'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

interface PieChartProps<T extends object> extends Formatters {
  compact: boolean
  data: T[]
  dataKey: Extract<keyof T, string>
  prependLegendList?: ReactNode
}

const colorPalette = ['#0500E2', '#0092f6', '#ffa800', '#d5d6d7']

type LegendListItemProps = {
  children: ReactNode
  compact: boolean
  isActive?: boolean
  color?: string
}

const LegendListItem: FC<LegendListItemProps> = ({ children, compact, isActive, color }) => {
  return (
    <li className="flex items-center">
      <div
        className={cn(
          'flex items-center justify-center rounded-full relative',
          compact ? 'w-8 h-8' : 'w-12 h-12',
          isActive && color ? '' : 'bg-transparent',
        )}
        style={isActive && color ? { backgroundColor: `${color}40` } : undefined}
      >
        <div
          className={cn('rounded-full', compact ? 'w-[10px] h-[10px]' : 'w-[15px] h-[15px]')}
          style={{ backgroundColor: color || COLORS.grayMedium }}
        />
      </div>
      <span
        className={cn(
          'ml-1',
          compact ? 'text-xs' : 'text-lg',
          isActive ? 'font-bold' : 'font-normal',
          isActive && color ? '' : 'text-gray-600',
        )}
        style={isActive && color ? { color } : undefined}
      >
        {children}
      </span>
    </li>
  )
}

type CustomLegendProps = Props & {
  activeLabel?: string
  compact: boolean
  prependLegendList?: ReactNode
}

const CustomLegend = (props: CustomLegendProps) => {
  const { activeLabel, compact, payload, prependLegendList } = props
  const { t } = useTranslation()

  return (
    <ul className="pb-2">
      {prependLegendList && <LegendListItem compact={compact}>{prependLegendList}</LegendListItem>}
      {payload?.map(item => {
        if (!item.payload) {
          return null
        }

        const payload = item.payload as PieSectorDataItem
        const label = payload.name
        const isActive = activeLabel === label
        return (
          <LegendListItem key={label} color={item.color} compact={compact} isActive={isActive}>
            {label} (
            {t('common.valuePair', {
              value: payload.percent,
              formatParams: {
                value: {
                  style: 'percent',
                  maximumFractionDigits: 2,
                } satisfies Intl.NumberFormatOptions,
              },
            })}
            )
          </LegendListItem>
        )
      })}
    </ul>
  )
}

const PieChartCmp = <T extends object>({
  compact,
  data,
  dataKey,
  formatters,
  prependLegendList,
}: PieChartProps<T>) => {
  const [activeLabel, setActiveLabel] = useState<string>()
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
        <Legend
          width={compact ? 150 : 250}
          layout="vertical"
          align="left"
          verticalAlign="middle"
          content={props => (
            <CustomLegend
              activeLabel={activeLabel}
              compact={compact}
              prependLegendList={prependLegendList}
              payload={props.payload}
            />
          )}
        />
        <Pie
          onMouseEnter={(item, index) => setActiveLabel(item[labelKey])}
          onMouseLeave={() => setActiveLabel(undefined)}
          stroke="none"
          data={data}
          innerRadius={compact ? 25 : 40}
          outerRadius={compact ? 50 : 90}
          paddingAngle={0}
          dataKey={dataKey}
        >
          {data.map((item, index) => {
            const label = item[labelKey as keyof T] as string
            return (
              <Cell
                fill={colorPalette[index % colorPalette.length]}
                key={`${label}-${index}`}
                name={label}
                style={{
                  filter: activeLabel === label ? `drop-shadow(0px 0px 5px ${COLORS.grayMedium}` : 'none',
                }}
              />
            )
          })}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export const PieChart = memo(PieChartCmp) as typeof PieChartCmp
