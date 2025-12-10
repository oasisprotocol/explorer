import { FC, ReactNode } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { TriangleAlert } from 'lucide-react'
import { COLORS } from '../../../styles/theme/colors'

type CardEmptyStateProps = {
  label: string
  action?: ReactNode
}

export const CardEmptyState: FC<CardEmptyStateProps> = ({ label, action }) => (
  <div className="flex flex-col justify-center items-center flex-1 gap-3 text-center px-1 pt-8 pb-16 sm:px-4 sm:pt-16 sm:pb-32">
    <TriangleAlert size={60} color={COLORS.warningColor} />
    <Typography className="block align-middle text-gray-700">
      {label}
      {action}
    </Typography>
  </div>
)
