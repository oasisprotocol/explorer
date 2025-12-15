/**
 * Copyright 2024 https://github.com/google/material-design-icons
 * SPDX-License-Identifier: Apache-2.0
 */

import { FC } from 'react'
import { Icon, IconNode } from 'lucide-react'

const developerBoardNode: IconNode = [
  [
    'path',
    {
      d: 'M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9zm-4 10H4V5h14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z',
      fill: 'currentColor',
      stroke: 'none',
    },
  ],
]

export const DeveloperBoard: FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => {
  return <Icon iconNode={developerBoardNode} size={size} className={className} />
}
