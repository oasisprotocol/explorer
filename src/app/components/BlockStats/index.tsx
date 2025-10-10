import { ReactNode } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { COLORS } from '../../../styles/theme/colors'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

const Square = ({ success }: { success?: boolean }) => (
  <div
    className={cn(
      'w-6 h-6 rounded-[3px]',
      success ? 'bg-[color:var(--success-color)]' : 'bg-[color:var(--error-color)]',
    )}
    style={{
      backgroundColor: success ? COLORS.eucalyptus : COLORS.errorIndicatorBackground,
    }}
  />
)

type BlockStatsProps<T> = {
  data: T[]
  dataKey: Extract<keyof T, string>
  legendLabels?: {
    success: string
    fail: string
  }
  tooltipFormatter?: (data: string) => ReactNode
}

export const BlockStats = <T extends { [key: string]: any }>({
  data,
  dataKey,
  legendLabels,
  tooltipFormatter,
}: BlockStatsProps<T>) => {
  const statusKey = Object.keys(data[0]).find(key => key !== dataKey)
  if (!statusKey) {
    throw new Error('Not able to determine status key')
  }

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {data.map(item => {
          const title = tooltipFormatter ? tooltipFormatter(item[dataKey].toString()) : item[dataKey]
          return (
            <Tooltip key={item[dataKey]} title={title} placement="top">
              <Square success={item[statusKey]} />
            </Tooltip>
          )
        })}
      </div>
      {legendLabels && (
        <div className="pt-8 flex">
          <div className="flex gap-2 mr-4">
            <Square success /> {legendLabels.success}
          </div>
          <div className="flex gap-2">
            <Square /> {legendLabels.fail}
          </div>
        </div>
      )}
    </>
  )
}
