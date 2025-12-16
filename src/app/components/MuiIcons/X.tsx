import { FC } from 'react'
import { Icon, IconNode } from 'lucide-react'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/X.js#L6
const xNode: IconNode = [
  [
    'path',
    {
      d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      fill: 'currentColor',
      stroke: 'none',
    },
  ],
]

export const X: FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => {
  return <Icon iconNode={xNode} size={size} className={className} />
}
