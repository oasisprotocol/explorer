import { FC, ReactNode } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { ChartColumnDecreasing } from 'lucide-react'

import { COLORS } from '../../../styles/theme/colors'

type AccountCardEmptyStateProps = {
  children?: ReactNode
  label: string
}

export const AccountCardEmptyState: FC<AccountCardEmptyStateProps> = ({ children, label }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 text-center pt-1 pb-2">
      <ChartColumnDecreasing size={36} color={COLORS.grayMedium} className="opacity-50" />
      <Typography textColor="muted" className="font-semibold text-center">
        {label}
      </Typography>
      {children}
    </div>
  )
}
