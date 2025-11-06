import { FC, ReactNode } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import { COLORS } from '../../../styles/theme/colors'

type AccountCardEmptyStateProps = {
  children?: ReactNode
  label: string
}

export const AccountCardEmptyState: FC<AccountCardEmptyStateProps> = ({ children, label }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 text-center pt-1 pb-2">
      <StackedBarChartIcon sx={{ color: COLORS.grayMedium, fontSize: 40, opacity: 0.5 }} />
      <Typography textColor="muted" className="font-semibold text-center">
        {label}
      </Typography>
      {children}
    </div>
  )
}
