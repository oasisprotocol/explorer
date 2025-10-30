import { FC } from 'react'
import Button from '@mui/material/Button'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { styled } from '@mui/material/styles'

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
        <Typography className="text-primary font-semibold">{label}</Typography>
      </StyledButton>
    </Tooltip>
  )
}
