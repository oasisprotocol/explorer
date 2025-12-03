import { FC, ReactNode } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { ChartColumnDecreasing } from 'lucide-react'
import { COLORS } from '../../../styles/theme/colors'

type ConsensusAccountCardEmptyStateProps = {
  children?: ReactNode
  label: string
}

export const ConsensusAccountCardEmptyState: FC<ConsensusAccountCardEmptyStateProps> = ({
  children,
  label,
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 text-center min-h-36 pt-2 sm:pt-16 sm:min-h-48">
      <ChartColumnDecreasing size={36} color={COLORS.grayMedium} className="opacity-50" />
      <Typography textColor="muted" className="font-semibold text-center">
        {label}
      </Typography>
      {children}
    </div>
  )
}
