import { ReactNode } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

const Square = ({ success, size = 32 }: { success?: boolean; size?: number }) => {
  const borderRadius = size <= 8 ? 2 : 6

  return (
    <div
      className={cn(success ? 'bg-success' : 'bg-destructive')}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${borderRadius}px`,
      }}
    />
  )
}

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
      <div className="flex flex-wrap gap-2">
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
          <div className="flex gap-2 mr-4 items-center">
            <Square success size={8} /> {legendLabels.success}
          </div>
          <div className="flex gap-2 items-center">
            <Square size={8} /> {legendLabels.fail}
          </div>
        </div>
      )}
    </>
  )
}
