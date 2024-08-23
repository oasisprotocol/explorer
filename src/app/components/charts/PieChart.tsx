import { FC, memo, ReactNode, useState } from 'react'
import { Legend, ResponsiveContainer, Tooltip, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CircleIcon from '@mui/icons-material/Circle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { TooltipContent, type Formatters } from './Tooltip'
import { COLORS } from '../../../styles/theme/colors'
import { COLORS as TESTNET_COLORS } from '../../../styles/theme/testnet/colors'
import { Props } from 'recharts/types/component/DefaultLegendContent'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

interface PieChartProps<T extends object> extends Formatters {
  compact: boolean
  data: T[]
  dataKey: Extract<keyof T, string>
  prependLegendList?: ReactNode
}

const colorPalette = [COLORS.brandDark, COLORS.brandMedium, TESTNET_COLORS.testnet, COLORS.grayMedium2]

type LegendListItemProps = {
  children: ReactNode
  compact: boolean
  isActive?: boolean
  color?: string
}

const LegendListItem: FC<LegendListItemProps> = ({ children, compact, isActive, color }) => {
  return (
    <ListItem sx={{ padding: 0 }}>
      <Box
        sx={{
          width: compact ? 32 : 48,
          height: compact ? 32 : 48,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: isActive && color ? `${color}40` : 'transparent',
        }}
      >
        <CircleIcon sx={{ color: color || COLORS.grayMedium, fontSize: compact ? 12 : 18 }} />
      </Box>
      <Typography
        component="span"
        sx={{
          color: isActive && color ? color : COLORS.grayMedium,
          fontSize: compact ? 12 : 18,
          ml: 2,
          fontWeight: isActive ? 700 : 400,
        }}
      >
        {children}
      </Typography>
    </ListItem>
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
    <List sx={{ listStyleType: 'none' }}>
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
    </List>
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
