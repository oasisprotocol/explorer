import { FC } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export const TransferIcon: FC = () => {
  return (
    <div className="flex justify-center items-center rounded-full w-8 h-8 ml-3 -mr-4 text-foreground text-lg">
      <ArrowForwardIcon fontSize="inherit" />
    </div>
  )
}
