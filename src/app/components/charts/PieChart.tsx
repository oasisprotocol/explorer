import { memo, useState } from 'react'
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
}

const colorPalette = [COLORS.brandDark, COLORS.brandMedium, TESTNET_COLORS.testnet, COLORS.grayMedium2]

type CustomLegendProps = Props & {
  activeIndex?: number
  compact: boolean
}

const CustomLegend = (props: CustomLegendProps) => {
  const { activeIndex, compact, payload } = props
  const { t } = useTranslation()

  return (
    <List sx={{ listStyleType: 'none' }}>
      {payload?.map((item, index) => {
        if (!item.payload) {
          return null
        }

        const payload = item.payload as PieSectorDataItem
        const isActive = activeIndex === index
        const label = payload.name
        return (
          <ListItem key={`item-${label}-${index}`} sx={{ padding: 0 }}>
            <Box
              sx={{
                width: compact ? 32 : 48,
                height: compact ? 32 : 48,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: isActive ? `${item.color}40` : 'transparent',
              }}
            >
              <CircleIcon sx={{ color: item.color, fontSize: compact ? 12 : 18 }} />
            </Box>
            <Typography
              component="span"
              sx={{
                color: isActive ? item.color : COLORS.grayMedium,
                fontSize: compact ? 12 : 18,
                ml: 2,
                fontWeight: isActive ? 700 : 400,
              }}
            >
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
            </Typography>
          </ListItem>
        )
      })}
    </List>
  )
}

const PieChartCmp = <T extends object>({ compact, data, dataKey, formatters }: PieChartProps<T>) => {
  const [activeIndex, setActiveIndex] = useState<number>()
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
            <CustomLegend activeIndex={activeIndex} compact={compact} payload={props.payload} />
          )}
        />
        <Pie
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(undefined)}
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
                  filter: activeIndex === index ? `drop-shadow(0px 0px 5px ${COLORS.grayMedium}` : 'none',
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
