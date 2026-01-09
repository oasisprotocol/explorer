import { FC } from 'react'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type TableHeaderToggleProps = {
  label: string
  onClick: () => void
  tooltipTitle: string
}

export const TableHeaderToggle: FC<TableHeaderToggleProps> = ({ label, onClick, tooltipTitle }) => {
  return (
    <Tooltip title={tooltipTitle}>
      <Button variant="link" onClick={onClick} className="p-0 min-w-auto h-auto">
        <Typography className="text-primary font-semibold">{label}</Typography>
      </Button>
    </Tooltip>
  )
}
