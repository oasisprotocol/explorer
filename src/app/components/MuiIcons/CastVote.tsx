import { FC } from 'react'
import { Icon, IconNode } from 'lucide-react'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/HowToVote.js#L6
const castVoteNode: IconNode = [
  [
    'path',
    {
      d: 'M18 13h-.68l-2 2h1.91L19 17H5l1.78-2h2.05l-2-2H6l-3 3v4c0 1.1.89 2 1.99 2H19c1.1 0 2-.89 2-2v-4zm-1-5.05-4.95 4.95-3.54-3.54 4.95-4.95zm-4.24-5.66L6.39 8.66c-.39.39-.39 1.02 0 1.41l4.95 4.95c.39.39 1.02.39 1.41 0l6.36-6.36c.39-.39.39-1.02 0-1.41L14.16 2.3c-.38-.4-1.01-.4-1.4-.01',
      fill: 'currentColor',
      stroke: 'none',
    },
  ],
]

export const CastVote: FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => {
  return <Icon iconNode={castVoteNode} size={size} className={className} />
}
