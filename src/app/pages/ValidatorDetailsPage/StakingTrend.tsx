import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { LineChart } from '../../components/charts/LineChart'
import { SearchScope } from 'types/searchScope'
import { useScreenSize } from '../../hooks/useScreensize'

export const StakingTrend: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  // TODO: provide data from the API is ready and sync dataKey value
  const windows = undefined

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('validator.stakingTrend')} />
      <CardContent sx={{ height: 250 }}>
        {windows && (
          <LineChart
            tooltipActiveDotRadius={9}
            cartesianGrid
            strokeWidth={3}
            dataKey={'volume'}
            data={windows}
            margin={{ bottom: 16, top: isMobile ? 0 : 16 }}
            tickMargin={16}
            withLabels
            formatters={{
              data: (value: number) => value.toLocaleString(),
              label: (value: string) =>
                t('common.formattedDateTime', {
                  timestamp: new Date(value),
                }),
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
