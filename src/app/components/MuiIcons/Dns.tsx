import { FC } from 'react'
import { Icon, IconNode } from 'lucide-react'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/Dns.js#L6
const dnsNode: IconNode = [
  [
    'path',
    {
      d: 'M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1M7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1M7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2',
      fill: 'currentColor',
      stroke: 'none',
      key: 'dns-path',
    },
  ],
]

export const Dns: FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => {
  return <Icon iconNode={dnsNode} size={size} className={className} />
}
