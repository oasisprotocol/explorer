import { FC } from 'react'
import { Icon, IconNode } from 'lucide-react'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/Stream.js#L5
const streamNode: IconNode = [
  [
    'circle',
    {
      cx: '20',
      cy: '12',
      r: '2',
      fill: 'currentColor',
      stroke: 'none',
      key: 'stream-circle-1',
    },
  ],
  [
    'circle',
    {
      cx: '4',
      cy: '12',
      r: '2',
      fill: 'currentColor',
      stroke: 'none',
      key: 'stream-circle-2',
    },
  ],
  [
    'circle',
    {
      cx: '12',
      cy: '20',
      r: '2',
      fill: 'currentColor',
      stroke: 'none',
      key: 'stream-circle-3',
    },
  ],
  [
    'path',
    {
      d: 'M10.05 8.59 6.03 4.55h-.01l-.31-.32-1.42 1.41 4.02 4.05.01-.01.31.32zm3.893.027 4.405-4.392L19.76 5.64l-4.405 4.393zM10.01 15.36l-1.42-1.41-4.03 4.01-.32.33 1.41 1.41 4.03-4.02zm9.75 2.94-3.99-4.01-.36-.35L14 15.35l3.99 4.01.35.35z',
      fill: 'currentColor',
      stroke: 'none',
      key: 'stream-path',
    },
  ],
  [
    'circle',
    {
      cx: '12',
      cy: '4',
      r: '2',
      fill: 'currentColor',
      stroke: 'none',
      key: 'stream-circle-4',
    },
  ],
]

export const Stream: FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => {
  return <Icon iconNode={streamNode} size={size} className={className} />
}
