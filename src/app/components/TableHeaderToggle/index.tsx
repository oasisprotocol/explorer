import { FC } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { TooltipWrapper as Tooltip } from '@oasisprotocol/ui-library/src/components/ui/tooltipWrapper'

const StyledButton = styled(Button)(() => ({
  padding: '0px',
  minWidth: 'auto',
  height: 'auto',
}))

type TableHeaderToggleProps = {
  label: string
  onClick: () => void
  tooltipTitle: string
}

export const TableHeaderToggle: FC<TableHeaderToggleProps> = ({ label, onClick, tooltipTitle }) => {
  return (
    <Tooltip title={tooltipTitle}>
      <StyledButton variant="text" onClick={onClick}>
        <Typography
          sx={{
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>
      </StyledButton>
    </Tooltip>
  )
}
